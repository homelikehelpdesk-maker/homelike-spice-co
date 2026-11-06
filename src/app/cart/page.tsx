'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem } = useCartStore()

  // Calculate the total price
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12">
      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
          <Link href="/">
            <Button variant="outline">Keep Shopping</Button>
          </Link>
        </div>
        
        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">Your cart is empty.</p>
            <Link href="/">
              <Button className="bg-[#E3342F] hover:bg-[#C82A26] text-white">Browse Spices</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <p className="text-gray-500 text-sm">₹{item.price} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="font-bold text-gray-900 text-lg">₹{item.price * item.quantity}</span>
                  <Button variant="destructive" size="sm" onClick={() => removeItem(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex justify-between items-center pt-4 text-2xl font-bold text-gray-900">
              <span>Total:</span>
              <span>₹{total}</span>
            </div>
            
            <div className="flex justify-end mt-8">
              <div className="flex justify-end mt-8">
  <Link href="/checkout">
    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-6 rounded-lg w-full md:w-auto">
      Proceed to Checkout
    </Button>
  </Link>
</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}