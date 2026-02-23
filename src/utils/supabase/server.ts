import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    // Fallback for build time if env vars are missing
    if (!supabaseUrl || !supabaseKey) {
        return createServerClient(
            'https://placeholder-url.supabase.co',
            'placeholder-key',
            {
                cookies: {
                    get() { return undefined },
                    set() { },
                    remove() { },
                }
            }
        )
    }

    const cookieStore = cookies()

    return createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value, ...options })
                } catch (error) {
                    // Ignored in Server Components
                }
            },
            remove(name: string, options: CookieOptions) {
                try {
                    cookieStore.set({ name, value: '', ...options })
                } catch (error) {
                    // Ignored in Server Components
                }
            },
        },
    })
}
