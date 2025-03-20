
// This file contains Stripe-related constants and configurations

// The Stripe publishable key should start with pk_test for test mode
// or pk_live for live mode. Never put secret keys in client-side code.
export const STRIPE_PUBLISHABLE_KEY = 'pk_live_51QdfYbD6fFdhmypR798NoSCJ4G9TGCkqw9QTuiDTkyvmn9tSrhey2n3cTHxjFG6GYDlcoBClLWsDN5Mgjb0tIfII00oVKQ67in'; // Use your actual publishable key

// Stripe API URL for use in server-side communication (when backend is added)
export const STRIPE_API_URL = 'https://api.stripe.com/v1';
