import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
        error
    } = await supabase.auth.getUser()

    // Protect all /admin routes except /admin/login
    const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
    const isLoginRoute = request.nextUrl.pathname.startsWith('/admin/login')

    if (isAdminRoute && !isLoginRoute) {
        if (!user) {
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/admin/login'
            return NextResponse.redirect(redirectUrl, {
                headers: supabaseResponse.headers,
            })
        }
    }

    // Redirect logged-in users away from the login page
    if (isLoginRoute) {
        if (user) {
            return NextResponse.redirect(new URL('/admin', request.url), {
                headers: supabaseResponse.headers,
            })
        }
    }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
