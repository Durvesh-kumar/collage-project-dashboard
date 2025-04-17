"use client"
import React, { useState } from "react";
import { buttonVariants } from "../ui/button";
import { LoaderCircle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Delete = ({ itemId, type }: { itemId: string; type: string }) => {
   const [loading, setLoading] = useState(false);
   const router = useRouter()
   
  const handelDelete = async(itemId:string)=>{
    setLoading(true)
    const url = type === "Collection" ? `/api/collections/${itemId}` : `/api/products/${itemId}`

    console.log(url);
    

    const res = await fetch(url, {
      method: "DELETE",
      cache: "no-store"
    });

    const data = await res.json()

    if(data.success){
      const path = type === "Collection" ? "/collections/all-collections" : "/products"
       toast.success(data.message);
       router.push(path)
       setLoading(false)
    }

    if(data.error){
      const path = type === "Collection" ? `/collections/details-collection/${itemId}` : `/products/details-product/${itemId}`
      toast.error(data.message);
      router.push(path)
      setLoading(false)
    }

  }

  const itemType = type === "Collection" ? "collection" : "product"

  return (
    <AlertDialog>
      <AlertDialogTrigger className={`${buttonVariants({ variant: "destructive" })}`}>
        <Trash2 className="h-4 w-4" />
      </AlertDialogTrigger>
      
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            {itemType} and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={()=> handelDelete(itemId)} disabled={loading}>{loading ? <LoaderCircle size={48} className="w-6 h-6 animate-spin"/> : "Continue"}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;