"use client"
import React, { useState } from 'react'
import LogInFacebook from './components/LogInFacebook'
import LogInGoogle from './components/LogInGoogle'
import LoginPassword from './components/LogInPassword'
import { useSession } from 'next-auth/react'

export default function Page() {
  const {data:session} = useSession();
  if(session?.user){
    window.location.replace("/")
  }
  const [loading, setLoading] = useState(false)
  return (
    <div className='w-full flex justify-center mt-20'>
        <div className='w-1/3 max-lg:w-1/2 max-md:w-full max-md:mx-20 max-sm:mx-10 dark:bg-transparent shadow-blue-500 p-5 shadow-md rounded-md'>
            <h1 className='text-4xl text-center font-bold mb-10'>Sign In</h1>
            <LogInFacebook loading={loading}/>
            <LogInGoogle  loading={loading}/>
            <LoginPassword loading={loading} setLoading={setLoading}/>
            <div className="flex items-center justify-center">
              
            <button
              type='button'
              onClick={() => window.location.replace('/sign-up')}
              className="text-sm text-blue-500 transition flex items-center justify-center duration-150 ease hover:text-blue-700">
              Don &apos;t have an account? sign Up
            </button>
          </div>
        </div>
    </div>
  )
}