"use client"
import React, { useState } from 'react'
import Register from './components/Register'
import UpGoogle from './components/UpGoogle'
import UpFacebook from './components/UpFacebook'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function Page() {
  const session = useSession();
  const router = useRouter()
  if(session){
     router.push("/")
  }
  const [loading, setLoading] = useState(false)
  return (
    <div className='w-full flex justify-center mt-20'>
        <div className='w-1/3 max-lg:w-1/2 max-md:w-full max-md:mx-20 max-sm:mx-10 dark:bg-transparent shadow-blue-500 p-5 shadow-md rounded-md'>
            <h1 className='text-4xl text-center font-bold mb-10'>Sign Up</h1>
            <div className='flex gap-4'>
              <UpGoogle loading={loading}/>
              <UpFacebook loading={loading}/>
            </div>
            <Register loading={loading} setLoading={setLoading}/>
            <div className="flex items-center justify-center">
            <button
              type='button'
              onClick={() => window.location.replace('/sign-in')}
              className="text-sm text-blue-500 transition flex items-center justify-center duration-150 ease hover:text-blue-700">
              You have an account? sign In
            </button>
          </div>
        </div>
    </div>
  )
}