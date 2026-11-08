'use client'

import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'

export default function Navbar() {
  const { cartCount } = useCartStore()
  const count = cartCount()

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo / Name */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black text-[#E3342F] tracking-tight">
            HomeLike Spices
          </span>
        </Link>
        
        {/* Navigation Links */}
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* CORRECTED: My Account now points to /login */}
          <Link href="/login">
            <Button variant="ghost" className="text-gray-600 hover:text-[#E3342F] hidden md:flex">
              My Account
            </Button>
          </Link>
          
          {/* CORRECTED: Cart now points to /cart */}
          <Link href="/cart">
            <Button className="bg-[#E3342F] hover:bg-[#C82A26] text-white flex items-center gap-2 px-4">
              <span>Cart</span>
              {count > 0 && (
                <span className="bg-white text-[#E3342F] px-2 py-0.5 rounded-full text-xs font-bold">
                  {count}
                </span>
              )}
            </Button>
          </Link>

        </div>
      </div>
    </nav>
  )
}