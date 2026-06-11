import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
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
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
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

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const role = user?.user_metadata?.role
  const path = request.nextUrl.pathname

  // Protect /app routes — must be logged in AND not a candidate
  if (path.startsWith('/app')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    // Candidates trying to access the recruiter portal get bounced to their own portal
    if (role === 'candidate') {
      const url = request.nextUrl.clone()
      url.pathname = '/portal'
      return NextResponse.redirect(url)
    }
  }

  // Protect /portal routes — must be logged in AND be a candidate
  if (path.startsWith('/portal')) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
    // Recruiters/Admins trying to access the candidate portal get bounced to the app
    if (role && role !== 'candidate') {
      const url = request.nextUrl.clone()
      url.pathname = '/app/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // Redirect logged-in users away from /login or /register to the right home
  if (user && (path.startsWith('/login') || path.startsWith('/register'))) {
    const url = request.nextUrl.clone()
    url.pathname = role === 'candidate' ? '/portal' : '/app/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
