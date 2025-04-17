import React from 'react'
import CollectionTable from './components/CollectionTable';
import { DataTable } from '@/components/coustemUI/DataTable';

export default async function page() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/collections`, {
        method: "GET",
        cache: "no-store", // Prevent caching for fresh data
      });

    if(!res.ok){
        return (
            <div className="flex items-center justify-center h-full">
              <p className="text-red-500">Error fetching collections. Please try again later.</p>
            </div>
          );
    }
    const data = await res.json()
    
    if(!data.collections || data.collections.length === 0){
        return (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-lg">No collections found.</p>
            </div>
          );
    }
  return (
    <div>
        <DataTable columns={CollectionTable} data={data.collections} searchKey='title' />
    </div>
  )
}