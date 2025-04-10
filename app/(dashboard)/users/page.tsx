import React from 'react'
import toast from 'react-hot-toast';
import UsersTable from './components/UserTable';
import { DataTable } from '@/components/coustemUI/DataTable';
import { redirect } from 'next/navigation';

export default async function page() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/users`, {
        method: "GET",
        cache: "no-store"
    })

    const data = await res.json()

    if(!data.users || data.users.length === 0){
        toast.error("No users found");
        redirect("/")
    }

  return (
    <div>
        <h1 className='font-bold text-3xl m-3'>Users list</h1>
        <hr className='h-1 bg-blue-500 rounded-full' />
        <div className='my-7'>
           <DataTable columns={UsersTable} data={data.users} searchKey='email'/>
        </div>
    </div>
  )
}