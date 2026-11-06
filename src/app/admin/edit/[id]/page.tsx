import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  
  // 1. Verify Admin Access
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/account')

  // 2. Fetch the specific product being edited
  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!product) redirect('/admin')

  // 3. Update Action
  async function updateProduct(formData: FormData) {
    'use server'
    const supabase = await createClient()
    
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const price = parseFloat(formData.get('price') as string)
    const stock = parseInt(formData.get('stock') as string)
    const is_active = formData.get('is_active') === 'true'
    const imageFile = formData.get('image') as File | null

    let image_url = product.image_url

    // Only upload a new image if the user selected one
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile)

      if (!uploadError) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(fileName)
        image_url = urlData.publicUrl
      }
    }
    
    const { error } = await supabase.from('products').update({ 
      name, 
      description, 
      price, 
      stock, 
      image_url, 
      is_active 
    }).eq('id', product.id)
    
    if (!error) {
      revalidatePath('/', 'layout')
      redirect('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <Link href="/admin">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>

        <form action={updateProduct} className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input type="text" name="name" defaultValue={product.name} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" defaultValue={product.description} required rows={3} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input type="number" name="price" defaultValue={product.price} step="0.01" required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input type="number" name="stock" defaultValue={product.stock} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Status</label>
            <select name="is_active" defaultValue={product.is_active.toString()} className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="true">Active (Visible in Store)</option>
              <option value="false">Draft (Hidden from Store)</option>
            </select>
          </div>

          <div className="pt-2 border-t border-gray-100 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Replace Product Image</label>
            {product.image_url && (
              <div className="mb-3">
                <img src={product.image_url} alt="Current product" className="h-24 w-24 object-cover rounded-md border" />
                <p className="text-xs text-gray-500 mt-1">Leave file input blank to keep this image.</p>
              </div>
            )}
            <input 
              type="file" 
              name="image" 
              accept="image/*" 
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
            />
          </div>

          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-6">
            Update Product
          </Button>
        </form>

      </div>
    </div>
  )
}