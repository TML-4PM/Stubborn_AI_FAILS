
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { action, data } = await req.json()
    const printifyToken = Deno.env.get('PRINTIFY_API_TOKEN')

    if (!printifyToken) {
      throw new Error('Printify API token not configured')
    }

    const printifyHeaders = {
      'Authorization': `Bearer ${printifyToken}`,
      'Content-Type': 'application/json',
    }

    let result = {}

    switch (action) {
      case 'sync_products':
        // Fetch products from Printify
        const productsResponse = await fetch('https://api.printify.com/v1/shops/YOUR_SHOP_ID/products.json', {
          headers: printifyHeaders
        })
        const products = await productsResponse.json()
        
        // Store products in database
        for (const product of products.data) {
          await supabaseClient
            .from('products')
            .upsert({
              printify_product_id: product.id,
              name: product.title,
              description: product.description,
              price: product.variants[0]?.price || 0,
              category: 'printify',
              is_printify_product: true,
              print_on_demand: true,
              coming_soon: true,
              printify_data: product,
              mockup_images: product.images,
              image_url: product.images[0]?.src || null
            }, {
              onConflict: 'printify_product_id'
            })
        }

        result = { success: true, synced: products.data.length }
        break

      case 'create_order':
        // Create order in Printify
        const orderResponse = await fetch('https://api.printify.com/v1/shops/YOUR_SHOP_ID/orders.json', {
          method: 'POST',
          headers: printifyHeaders,
          body: JSON.stringify(data.order)
        })
        const order = await orderResponse.json()
        
        // Store order tracking info
        await supabaseClient
          .from('printify_orders')
          .insert({
            order_id: data.order_id,
            printify_order_id: order.id,
            printify_status: order.status
          })

        result = { success: true, printify_order: order }
        break

      case 'get_order_status':
        // Get order status from Printify
        const statusResponse = await fetch(`https://api.printify.com/v1/shops/YOUR_SHOP_ID/orders/${data.printify_order_id}.json`, {
          headers: printifyHeaders
        })
        const orderStatus = await statusResponse.json()
        
        // Update local order status
        await supabaseClient
          .from('printify_orders')
          .update({
            printify_status: orderStatus.status,
            tracking_number: orderStatus.tracking_number,
            tracking_url: orderStatus.tracking_url
          })
          .eq('printify_order_id', data.printify_order_id)

        result = { success: true, status: orderStatus }
        break

      default:
        throw new Error('Unknown action')
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )

  } catch (error) {
    console.error('Printify integration error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
