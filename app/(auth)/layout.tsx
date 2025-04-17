import AuthProvider from '@/lib/actions/AuthProvider'
import React from 'react'

export default function layout({children}:{children: React.ReactNode}) {
  return (
    <AuthProvider>
{    children}
    </AuthProvider>
  )
}
