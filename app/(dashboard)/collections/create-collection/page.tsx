import React from 'react'
import { CollectionForm } from '../components/CollectionForm'
import { auth } from '@/auth'

export default async function page() {
  const session = await auth()
  if(!session){
    window.location.replace("/sign-in");
  }

  if(session &&(session.collectionId)){
    window.location.replace("/collections/collection-dashboard");
  }

  if(session &&(session.role === "USER")){
    window.location.replace("/collections");
  }
  return (
    <div>
        <CollectionForm />
    </div>
  )
}