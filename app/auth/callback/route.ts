import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // next is the default fallback, but we dynamically route based on role
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // Determine user role and redirect
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()
          
        const role = profile?.role
        
        let redirectPath = '/dashboard' // Default therapist/user dashboard
        if (role === 'admin') {
          redirectPath = '/admin'
        } else if (role === 'researcher') {
          redirectPath = '/researcher'
        }
        
        return NextResponse.redirect(`${origin}${redirectPath}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Could not authenticate user`)
}
