import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // Redirects guests to the login page
    redirect('/login') 
  }

  return <>{children}</>
}