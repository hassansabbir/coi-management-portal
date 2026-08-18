import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refreshes the Supabase session cookie on every request.
 * Called from the root middleware.ts.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session — do NOT remove this line
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Public paths that don't require auth
  const publicPaths = ['/login', '/forgot-password', '/reset-password', '/verify-otp', '/password-changed', '/auth/callback'];
  const isPublicPath = publicPaths.some((p) => pathname.startsWith(p));

  // If not authenticated and not on a public path, redirect to login
  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If authenticated, enforce role-based routing
  if (user) {
    // Fetch role from user_profiles
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    console.log('=== MIDDLEWARE DEBUG ===');
    console.log('User ID:', user.id);
    console.log('Profile Data:', profile);
    console.log('Profile Error:', error);

    const role = profile?.role ?? 'client';
    console.log('Final Computed Role:', role);

    // Admin trying to access portal → redirect to admin
    if (role === 'admin' && pathname.startsWith('/portal')) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }

    // Client trying to access admin → redirect to portal
    if (role === 'client' && pathname.startsWith('/admin')) {
      const url = request.nextUrl.clone();
      url.pathname = '/portal';
      return NextResponse.redirect(url);
    }

    // Redirect root to correct area
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = role === 'admin' ? '/admin/dashboard' : '/portal';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
