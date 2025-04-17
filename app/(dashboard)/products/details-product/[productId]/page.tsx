import { auth } from '@/auth';
import React from 'react'
import toast from 'react-hot-toast';
import ProductDetails from '../components/ProductDetails';
import { redirect } from 'next/navigation';

export default async function page({params}: {params: Promise<{ productId: string }>}) {

    const productId = (await params).productId;

    if(!productId){
        toast.error("ProductId is required");
        redirect("/products")
    }

    const session = await auth();

    if(!session){
        redirect("/sign-in")
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${productId}`,{
        method: "GET",
        cache: "no-store"
    });

    const data = await res.json()

    if(!data.product || data.product.length === 0){
        toast.error("Product is not found");
        redirect("/products")
    }

  return <ProductDetails productData={data.product} session={session!}/>
}