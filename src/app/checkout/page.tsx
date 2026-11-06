'use client'

import { useCartStore } from '@/store/cart'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { placeOrder, getCheckoutUser } from './actions'

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const router = useRouter()
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  useEffect(() => {
    async function checkUser() {
      const currentUser = await getCheckoutUser()
      setUser(currentUser)
      setCheckingAuth(false)
    }
    checkUser()
  }, [])

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    const result = await placeOrder(formData, items, total)
    
    if (result?.error === "auth_required") {
      alert("Please log in to place an order.")
      router.push('/login')
      return
    }
    
    if (result?.error) {
      alert("Error placing order: " + result.error)
      setIsSubmitting(false)
    } else {
      clearCart()
      router.push('/success')
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-12 text-center">
        <p className="text-gray-600">Checking account status...</p>
      </div>
    )
  }

  // BLOCK GUESTS FROM SEEING THE CHECKOUT FORM
  if (!user) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center max-w-md w-full space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">Login Required</h1>
          <p className="text-gray-600 text-sm">
            You must be signed in to your HomeLike Spices account before you can place an order.
          </p>
          <div className="pt-2 flex flex-col gap-3">
            <Link href="/login">
              <Button className="w-full bg-[#E3342F] hover:bg-[#C82A26] text-white">
                Sign In to Checkout
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full">
                Back to Cart
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link href="/"><Button>Return to Store</Button></Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6 pb-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Shipping Details</h2>
              <p className="text-xs text-green-700 mt-1">Logged in as: {user.email}</p>
            </div>
            <Link href="/account">
              <Button variant="outline" size="sm">Account</Button>
            </Link>
          </div>

          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input type="text" name="name" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3342F] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input type="tel" name="phone" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3342F] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complete Delivery Address</label>
              <textarea name="address" required rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#E3342F] outline-none" placeholder="House/Flat No., Street, Landmark, PIN Code"></textarea>
            </div>
            
            <div className="pt-4">
              <Button type="submit" disabled={isSubmitting} className="w-full bg-[#E3342F] hover:bg-[#C82A26] text-white text-lg py-6">
                {isSubmitting ? 'Processing...' : 'Place Order (Cash on Delivery)'}
              </Button>
            </div>
          </form>
        </div>

        <div className="bg-gray-50 p-8 rounded-xl border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-gray-600">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xl font-bold text-gray-900">
            <span>Total to Pay</span>
            <span>₹{total}</span>
          </div>
        </div>

      </div>
    </div>
  )
}