'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CartWidget() {
  const count = useCartStore((state) => state.cartCount())

  return (
    <Link href="/cart">
      <Button variant="outline" size="sm" className="relative border-gray-300">
        Cart 
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#E3342F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {count}
          </span>
        )}
      </Button>
    </Link>
  )
}