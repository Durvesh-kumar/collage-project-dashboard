import { buttonVariants } from '@/components/ui/button'
import { Store } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export default function NoCreateCollection() {
  return(
    <div className='flex items-center justify-center w-full *:h-screen text-xl'>
    <div className='space-y-3 flex flex-col items-center justify-center'>
      <div className='bg-primary rounded-full w-40 h-40 flex items-center justify-center'>
      <Store size={70} />
      </div>
       
       <h1 className='text-center text-2xl text-slate-500'>No collection create yet</h1>
       <p className='text-center text-slate-400'>You can not work without create collection.</p>
       <p className='text-slate-400'>Create collection now</p>
       <Link href="/collections/create-collection" className={buttonVariants()}>Create now</Link>
    </div>
    </div>
   )
}
