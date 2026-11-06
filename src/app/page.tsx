import AddToCartButton from '@/components/AddToCartButton'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'

export default async function Home() {
  const supabase = await createClient()

  // Fetch only active products for the public store
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      {/* Global Navbar is now handled in layout.tsx */}

      <main className="max-w-6xl mx-auto p-6 md:p-12">
        
        {/* Hero Section */}
        <div className="bg-[#E3342F] rounded-3xl p-10 md:p-20 mb-16 text-white text-center shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
              Authentic Flavors, <br className="hidden md:block" /> Delivered Home.
            </h1>
            <p className="text-lg md:text-xl text-red-50 max-w-2xl mx-auto mb-8 font-medium">
              Elevate your everyday cooking with HomeLike Spices. Premium quality, hand-picked, and ground to perfection for the perfect Indian kitchen.
            </p>
            <a href="#shop">
              <Button className="bg-white text-[#E3342F] hover:bg-gray-100 text-lg px-8 py-6 rounded-full font-bold shadow-sm transition-transform hover:scale-105">
                Shop Our Spices
              </Button>
            </a>
          </div>
        </div>

        {/* Product Grid */}
        <div id="shop" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products?.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow">
              
              {/* Dynamic Product Image rendering */}
              <div className="h-48 bg-gray-50 rounded-lg mb-4 flex items-center justify-center border border-gray-100 overflow-hidden">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Product Image</span>
                )}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-6 flex-grow leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex justify-between items-center mt-auto">
                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                <AddToCartButton product={product} />
              </div>
            </div>
          ))}
          
          {(!products || products.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500">
              New spices are arriving soon!
            </div>
          )}
        </div>
      </main>
    </div>
  )
}