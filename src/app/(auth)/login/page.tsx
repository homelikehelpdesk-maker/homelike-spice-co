'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { login } from './actions'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    const formData = new FormData(event.currentTarget)
    
    try {
      const result = await login(formData)
      if (result?.error) {
        setErrorMsg(result.error)
        setLoading(false)
      }
    } catch (err: any) {
      // Next.js redirect throws a special error which we must allow to pass through
      if (err.message?.includes('NEXT_REDIRECT')) {
        return
      }
      setErrorMsg("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-[#E3342F]">Homelike Spice Co.</h1>
          <p className="text-sm text-gray-500">Welcome back! Sign in to your account.</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm border border-red-200">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              name="email" 
              defaultValue="chetan1913051012@gmail.com" 
              required 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3342F] outline-none text-sm" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              name="password" 
              required 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E3342F] outline-none text-sm" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-[#E3342F] hover:bg-[#C82A26] text-white py-5 rounded-lg font-medium"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-[#E3342F] font-medium hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  )
}