
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const getDonorLevel = (amount: number) => {
  if (amount >= 100000000) return "Hall of Fame"; // $1M in cents
  if (amount >= 100000) return "Champion"; // $1000 in cents
  if (amount >= 50000) return "Champion"; // $500 in cents
  if (amount >= 10000) return "Legend"; // $100 in cents
  if (amount >= 2500) return "Super Fan"; // $25 in cents
  return "Supporter";
};

const getProductDescription = (amount: number, level: string) => {
  if (level === "Hall of Fame") return "🏆 Hall of Fame Donation - AI Oopsies Legend!";
  if (level === "Champion") return "🥇 Champion Level Donation - AI Oopsies Champion!";
  if (level === "Legend") return "🏅 Legend Level Donation - AI Oopsies Legend!";
  if (level === "Super Fan") return "⭐ Super Fan Donation - AI Oopsies Super Fan!";
  return "❤️ Supporter Donation - Keep AI Oopsies Running!";
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }

    const { amount } = await req.json();
    
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount provided");
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    let user = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const token = authHeader.replace("Bearer ", "");
        const { data } = await supabase.auth.getUser(token);
        user = data.user;
      } catch (error) {
        console.log("No authenticated user, proceeding as guest");
      }
    }

    let customerId = null;
    let customerEmail = "guest@aioopsies.com";
    
    if (user?.email) {
      customerEmail = user.email;
      const customers = await stripe.customers.list({ 
        email: user.email, 
        limit: 1 
      });
      
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    const amountInCents = Math.round(amount * 100);
    const donorLevel = getDonorLevel(amountInCents);
    const productDescription = getProductDescription(amountInCents, donorLevel);

    // Create enhanced success URL with donor level
    const baseSuccessUrl = `${req.headers.get("origin") || "https://aioopsies.com"}/donate?success=true`;
    const successUrl = `${baseSuccessUrl}&level=${encodeURIComponent(donorLevel)}&amount=${amount}`;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `AI Oopsies ${donorLevel} Donation`,
              description: productDescription,
              images: donorLevel === "Hall of Fame" ? ["https://aioopsies.com/hall-of-fame-badge.png"] : undefined,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: `${req.headers.get("origin") || "https://aioopsies.com"}/donate?canceled=true`,
      metadata: {
        user_id: user?.id || "guest",
        amount: amount.toString(),
        donor_level: donorLevel,
        tier_amount: amountInCents.toString(),
      },
    });

    // Record donation with enhanced data
    await supabase.from("donations").insert({
      user_id: user?.id || null,
      stripe_session_id: session.id,
      amount: amountInCents,
      currency: "usd",
      status: "pending",
      donor_email: customerEmail,
      // Note: If you want to add donor_level column to donations table, 
      // you'd need to run a migration first
    });

    console.log(`Created ${donorLevel} level donation session for $${amount}`);

    return new Response(JSON.stringify({ sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Checkout creation error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
