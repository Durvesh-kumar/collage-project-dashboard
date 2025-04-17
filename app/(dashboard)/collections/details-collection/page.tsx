import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import React from 'react'
import toast from 'react-hot-toast'

export default async function page() {
    const session = await auth()

    if(!session){
        redirect("/collections")
    }

    const collectionId = session &&(session.collectionId)

    if(collectionId){
      redirect("collections/create-collection")
    }

    const res = await fetch( `/api/collections/${session?.collectionId}`, {
      method: "GET",
    })

    if(!res.ok){
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">Error fetching collection. Please try again later.</p>
        </div>
      );
    }

    const data = await res.json()

    if(data.error || !data.collection){
      toast.error(data.message);
      redirect("/collections")
    }
    
  return (
    <div>page</div>
  )
}
