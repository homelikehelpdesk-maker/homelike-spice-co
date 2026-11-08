'use client'

import { Button } from '@/components/ui/button'
import { logout } from '@/app/(auth)/actions'

export default function SignOutButton() {
  const handleSignOut = async () => {
    // 1. Wipe the browser's Local Storage (where Zustand saves the cart)
    localStorage.clear()
    
    // 2. Trigger the server action to log out of Supabase
    await logout()
  }

  return (
    <form action={handleSignOut}>
      <Button variant="outline" type="submit">Sign Out</Button>
    </form>
  )
}