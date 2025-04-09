import { auth } from '@/auth'
import React from 'react'
import toast from 'react-hot-toast'

export default async function page() {
    const session = await auth()

    if(!session){
        window.location.href="/collections"
    }

    if(session && !session.collectionId){
      window.location.href="collections/create-collection"
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
      window.location.href="/collections"
    }
    console.log(data.collection);
    
  return (
    <div>page</div>
  )
}
