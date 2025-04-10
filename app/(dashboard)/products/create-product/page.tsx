import { auth } from '@/auth'
import React from 'react'
import { ProductForm } from '../components/ProductForm'
import { redirect } from 'next/navigation'

export default async function page() {
    const session = await auth()
    if(!session){
        redirect("/sign-in")
    }


    const collectionId = session && (session.collectionId)

    if(!collectionId){
        redirect("/collections/create-collection")
    }

    if(session &&(session.role === "USER")){
        redirect("/products")
    }
    
  return <ProductForm />
}