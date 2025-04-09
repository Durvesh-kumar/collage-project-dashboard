import { auth } from '@/auth'
import React from 'react'
import { ProductForm } from '../components/ProductForm'

export default async function page() {
    const session = await auth()
    if(!session){
        window.location.replace("/sign-in")
    }

    if(session && (!session.collectionId)){
        window.location.replace("/collections/create-collection")
    }

    if(session &&(session.role === "USER")){
        window.location.replace("/products")
    }
    
  return <ProductForm />
}