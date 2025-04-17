import { auth } from '@/auth'
import React from 'react'
import { ProductForm } from '../../components/ProductForm';

export default async function page({params}:{params: Promise<{productId: string}>}) {
  const productId = (await params).productId

  const session = await auth();

  if(!productId){
    window.location.replace("/products")
  }

  if(!session){
    window.location.replace("/sign-in")
  }

  if(session && (session.role === "USER")){
    window.location.replace("/products")
  }

  if(session && (!session.collectionId)){
    window.location.replace("/collections/create-collection")
  }

  const findProduct = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    cache: "no-store"
  });

  if(!findProduct.ok){
    window.location.replace("/products")
  }

  const data = await findProduct.json()

  if(!data.product || data.product.length === 0){
    window.location.replace("/products")
  }

  if(data.product.collectionId !== session?.collectionId){
    window.location.replace("/products")
  }

  return <ProductForm initialData={data.product}/>
}