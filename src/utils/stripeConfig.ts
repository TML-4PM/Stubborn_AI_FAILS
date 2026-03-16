// Stripe config — publishable key via env var (set VITE_STRIPE_PUBLISHABLE_KEY in Vercel)
// Live key: pk_live_51QdfYbD6... — retrieve from Stripe dashboard and set in Vercel env

export const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QdfYbD6fFdhmypR798NoSCJ4G9TGCkqw9QTuiDTkyvmn9tSrhey2n3cTHxjFG6GYDlcoBClLWsDN5Mgjb0tIfII00oVKQ67in';

export const STRIPE_SUCCESS_URL = '/shop?success=true';
export const STRIPE_CANCEL_URL = '/shop?canceled=true';
