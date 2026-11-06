import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/(auth)/actions'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/account')

  // Server Action to update order status
  async function markAsShipped(formData: FormData) {
    'use server'
    const supabase = await createClient()
    const orderId = formData.get('orderId') as string
    
    await supabase.from('orders').update({ status: 'shipped' }).eq('id', orderId)
    revalidatePath('/admin')
  }

  // Fetch Inventory
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  // Fetch All Orders (Admins see everything)
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">HomeLike Spices Admin</h1>
            <p className="text-gray-500">Inventory and Order Management</p>
          </div>
          <form action={logout}>
            <Button variant="destructive" type="submit">Sign Out</Button>
          </form>
        </div>

        {/* Live Orders Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            Recent Orders
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Contact</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status & Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 font-medium text-gray-900">
                      {order.customer_name}
                      <div className="text-xs text-gray-500 font-normal mt-1 max-w-xs truncate">
                        {order.shipping_address}
                      </div>
                    </td>
                    <td className="py-4 text-gray-600">{order.phone}</td>
                    <td className="py-4 font-semibold text-gray-900">₹{order.total_amount}</td>
                    <td className="py-4 flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 
                        'bg-blue-100 text-blue-800 border-blue-200'
                      }`}>
                        {order.status}
                      </span>
                      
                      {order.status === 'pending' && (
                        <form action={markAsShipped}>
                          <input type="hidden" name="orderId" value={order.id} />
                          <Button type="submit" variant="outline" size="sm" className="h-7 text-xs bg-white">
                            Mark Shipped
                          </Button>
                        </form>
                      )}
                    </td>
                  </tr>
                ))}
                {(!orders || orders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">No orders yet. Keep marketing!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Inventory Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Current Inventory</h2>
            <Link href="/admin/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add New Product</Button>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-500 text-sm">
                  <th className="pb-3 font-medium">Product Name</th>
                  <th className="pb-3 font-medium">Price (₹)</th>
                  <th className="pb-3 font-medium">Stock</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-4 font-medium text-gray-900">{product.name}</td>
                    <td className="py-4 text-gray-600">₹{product.price}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock} in stock
                      </span>
                    </td>
                    <td className="py-4 text-gray-600">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${product.is_active ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        {product.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <Link href={`/admin/edit/${product.id}`}>
                        <Button variant="outline" size="sm" className="h-7 text-xs">Edit</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}