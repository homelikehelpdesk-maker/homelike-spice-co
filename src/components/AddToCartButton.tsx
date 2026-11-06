'use client'

import { Button } from '@/components/ui/button'
import { useCartStore } from '@/store/cart'

export default function AddToCartButton({ product }: { product: { id: string, name: string, price: number } }) {
  const addItem = useCartStore((state) => state.addItem)

  const handleAdd = () => {
    addItem({ id: product.id, name: product.name, price: product.price, quantity: 1 })
    alert(`${product.name} added to cart!`) // Temporary feedback until we build a slide-out cart
  }

  return (
    <Button onClick={handleAdd} className="bg-[#E3342F] hover:bg-[#C82A26] text-white">
      Add to Cart
    </Button>
  )
}