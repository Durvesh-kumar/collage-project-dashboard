import React from 'react'
import toast from 'react-hot-toast'
import DetailsCollections from './components/DetailsCollections';

const fetchData = async(collectionId:string)=>{
    const res = await fetch( `${process.env.NEXT_PUBLIC_BASE_URL}/api/collections/${collectionId}`, {
        method: "GET",
      })

      if(!res.ok){
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error fetching collection. Please try again later.</p>
          </div>
        );
      }

      return await res.json()
}

export default async function page({params}:{params: Promise<{collectionId: string}>}) {

  const collectionId = (await params).collectionId

    
    const data = await fetchData(collectionId)

    if(data.error || !data.collection){
      toast.error(data.message);
      window.location.href="/collections"
    }
    
  return <DetailsCollections collection={data.collection} />
}