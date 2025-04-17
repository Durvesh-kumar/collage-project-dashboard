import { auth } from '@/auth'

import React from 'react'
import NoCreateCollection from './components/NoCreateCollection'
import { redirect } from 'next/navigation';

export default async function page() {
  
const session = await auth()

if (!session) {
  redirect('/collections/all-collections');
}

if(session && (session.role === "USER")){
  redirect("/collections/all-collections")
}

const collectionId = await session && session?.collectionId

if (collectionId) {
  redirect("/collections/collection-dashboard")
} else if(!collectionId) {
  return <NoCreateCollection/>
}
  
}