import React from 'react'
import ProductsTable from './components/ProductsTable';
import { auth } from '@/auth';
import { buttonVariants } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from '@/components/coustemUI/DataTable';

export default async function page() {

  const session = await auth()

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products`, {
    method: "GET",
    cache: "no-store"
  });

  if(!res.ok){
      return (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error fetching products. Please try again later.</p>
          </div>
        );
  }

  const data = await res.json();

  return (
    <div className='flex flex-col'>
      <h1 className='font-bold text-3xl m-3'>Products list</h1>
      <hr className='h-1 shadow-md bg-blue-400' />
      {
        session && (session.role !== "USER") ? (
          <div className='flex justify-end mr-7 mt-4'>
            <Link href="/products/create-product" className={`${buttonVariants({ variant: 'default' })} my-4`}>Create Producut <PlusIcon className='w-6 h-6'/></Link>
          </div>
        ): null 
      }

      {
        !data.products || data.products === 0 ? (
          <div className="flex items-center justify-center h-full">
        <p className="text-gray-500 text-lg">No products found.</p>
      </div>
        ) 
        :
        (
          <div className='flex flex-col'>
            <DataTable columns={ProductsTable} data={data.products} searchKey='title'/>
          </div>
        )
      }
    </div>
  )
}