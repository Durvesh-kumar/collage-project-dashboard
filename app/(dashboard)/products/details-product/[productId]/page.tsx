import { auth } from '@/auth';
import React from 'react'
import toast from 'react-hot-toast';
import ProductDetails from '../components/ProductDetails';

export default async function page({params}: {params: Promise<{ productId: string }>}) {

    const productId = (await params).productId;

    if(!productId){
        toast.error("ProductId is required");
        window.location.replace("/products")
    }

    const session = await auth();

    if(!session){
        window.location.replace("/sign-in")
    }

    const res = await fetch(`/api/products/${productId}`,{
        method: "GET",
        cache: "no-store"
    });

    const data = await res.json()

    if(!data.product || data.product.length === 0){
        toast.error("Product is not found");
        window.location.replace("/products")
    }

  return <ProductDetails productData={data.product} session={session!}/>
}