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

if (session && (session.collectionId || session.role !== "USER")) {
  redirect("/collections/collection-dashboard")
} else if(session && (!session.collectionId)) {
  return <NoCreateCollection/>
}
  
}