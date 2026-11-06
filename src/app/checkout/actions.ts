'use server'

import { createClient } from '@/lib/supabase/server'

// Check if the visitor is currently logged in
export async function getCheckoutUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user ? { id: user.id, email: user.email } : null
}

export async function placeOrder(formData: FormData, cartItems: any[], total: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Block order if not logged in
  if (!user) {
    return { error: "auth_required" }
  }

  const name = formData.get('name') as string
  const phone = formData.get('phone') as string
  const address = formData.get('address') as string

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert([{
      user_id: user.id,
      customer_name: name,
      phone: phone,
      shipping_address: address,
      total_amount: total,
      status: 'pending'
    }])
    .select()
    .single()

  if (orderError) return { error: orderError.message }

  const itemsToInsert = cartItems.map(item => ({
    order_id: order.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_time: item.price
  }))

  const { error: itemsError } = await supabase.from('order_items').insert(itemsToInsert)
  
  if (itemsError) return { error: itemsError.message }

  return { success: true, orderId: order.id }
}