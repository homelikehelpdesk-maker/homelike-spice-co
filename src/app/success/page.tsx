import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center max-w-lg">
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Confirmed!</h1>
        <p className="text-gray-600 mb-8">Thank you for choosing HomeLike Spices. Your order has been placed successfully and will be delivered soon.</p>
        <Link href="/">
          <Button className="bg-[#E3342F] hover:bg-[#C82A26] text-white">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  )
}