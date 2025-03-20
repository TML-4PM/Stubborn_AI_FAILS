
// This file contains Stripe-related constants and configurations

// The Stripe publishable key should start with pk_test for test mode
// or pk_live for live mode. Never put secret keys in client-side code.
export const STRIPE_PUBLISHABLE_KEY = 'pk_test_51QdfYbD6fFdhmypR798NoSCJ4G9TGCkqw9QTuiDTkyvmn9tSrhey2n3cTHxjFG6GYDlcoBClLWsDN5Mgjb0tIfII00oVKQ67in'; 

// API endpoint for creating checkout sessions
export const CHECKOUT_API_URL = 'https://aioopsies-stripe.netlify.app/.netlify/functions/create-checkout';

// Success and cancel return URLs
export const STRIPE_SUCCESS_URL = 'https://aioopsies.com/donate?success=true';
export const STRIPE_CANCEL_URL = 'https://aioopsies.com/donate?canceled=true';
