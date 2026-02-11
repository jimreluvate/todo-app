'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function VerificationSentPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      router.push('/auth/signin')
    }, 10000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-extrabold text-gray-900">
            Check Your Email!
          </h2>
          
          <p className="mt-4 text-lg text-gray-600">
            We've sent a verification email to your inbox.
          </p>
          
          <p className="mt-2 text-sm text-gray-500">
            Click the verification link in the email to complete your registration.
          </p>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              📧 What's next?
            </h3>
            <ul className="text-sm text-blue-700 space-y-1 text-left">
              <li>• Check your email inbox</li>
              <li>• Click the verification link</li>
              <li>• Start using Todo App!</li>
            </ul>
          </div>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-gray-500">
              Didn't receive the email?
            </p>
            <button
              onClick={() => router.push('/auth/resend-verification')}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Resend Verification Email
            </button>
            
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Sign In
            </button>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            You will be automatically redirected to the sign in page in 10 seconds...
          </p>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
