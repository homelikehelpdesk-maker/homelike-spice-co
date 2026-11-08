import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import SignOutButton from '@/components/SignOutButton'

export default async function AccountPage() {
  const supabase = await createClient()

  // 1. Verify logged-in user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // 2. Fetch profile details
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 3. Fetch live orders for this user
  const { data: orders } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Navigation Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold text-[#E3342F]">My Account</h1>
            <p className="text-gray-900 font-medium mt-1">
              Welcome back, {profile?.full_name || 'Customer'}!
            </p>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/">
              <Button className="bg-[#E3342F] hover:bg-[#C82A26] text-white">
                Shop Spices
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="outline">My Cart</Button>
            </Link>

            {profile?.role === 'admin' && (
              <Link href="/admin">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Admin Panel
                </Button>
              </Link>
            )}

            {/* CORRECTED: The new Client Component is now handling the sign out */}
            <SignOutButton />
          </div>
        </div>

        {/* Live Order History Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Order History</h2>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      Ordered on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="font-semibold text-gray-900">{order.customer_name}</p>
                    <p className="text-sm text-gray-600">{order.shipping_address}</p>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{order.total_amount}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider border ${
                        order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : 'bg-blue-100 text-blue-800 border-blue-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">You have not placed any orders with this account yet.</p>
              <Link href="/">
                <Button className="bg-[#E3342F] hover:bg-[#C82A26] text-white">
                  Browse Spices
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}