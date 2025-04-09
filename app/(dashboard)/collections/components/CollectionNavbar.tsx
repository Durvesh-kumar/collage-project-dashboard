"use client"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import navLinks from "./navLinks"
import { buttonVariants } from '@/components/ui/button'

export default function CollectionNavbar() {
  const usePath = usePathname()
  return (
    <div className='flex items-center justify-around py-3 border-separate border-b'>
      {
        navLinks.map((item)=>(
          <Link key={item.lable} href={item.url} className={buttonVariants({variant: usePath === item.url ? "activeItme": "items"})}>{item.lable}</Link>
        ) )
      }
    </div>
  )
}