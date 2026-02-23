import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fallback for build time if env vars are missing
    if (!supabaseUrl || !supabaseKey) {
        return createBrowserClient(
            'https://placeholder-url.supabase.co',
            'placeholder-key',
            { cookieOptions: { secure: true } }
        )
    }

    return createBrowserClient(supabaseUrl, supabaseKey, {
        cookieOptions: {
            secure: process.env.NODE_ENV === 'production',
        }
    })
}
