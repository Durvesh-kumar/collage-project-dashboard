import Link from "next/link";
import { Edit2 } from "lucide-react";
import IndianCurrency from "@/helpers/IndianCurrency";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Gallery from "./Gallery";
import { Session } from "next-auth";
import React from "react";
import Delete from "@/components/coustemUI/Delete";
// import Reviews from "./Reviews";

interface Props {
    productData: ProductType;
    session: Session
}

const ProductDetails:React.FC<Props>= ({ productData, session }) => {

    return (
        <>
            <h1 className="flex items-center justify-center my-6 text-3xl font-bold">
                {productData?.title}
            </h1>
            <hr className="bg-gray-900 py-0.5 my-5 shadow-lg rounded-xl" />
            <section className="flex items-center justify-center my-7">
                <Gallery media={productData?.media || []} />
            </section>
            <section>
                <h2 className="font-bold my-3 text-lg text-foreground">Discription:</h2>
                <p
                    className="mt-3 scrollbar-hide px-3 text-sm"
                >
                    {productData?.description}
                </p>
            </section>
            <section className="flex gap-x-10 items-center my-5">
                <div className="flex items-center gap-4">
                    <h1 className="font-bold my-3 text-lg">
                        Price &nbsp;:
                    </h1>
                    <p className="text-gray-500 line-through">{IndianCurrency(productData?.price)}</p>
                </div>
                <div className="flex items-center gap-4">
                    <h1 className="font-bold my-3 text-lg">Pay &nbsp;:</h1>
                    <p className="text-gray-500">{IndianCurrency(productData?.pay)}</p>
                </div>
            </section>
            <section className="grid lg:grid-cols-2 lg:gap-4 text-xl">

                <div className="">
                    <h3 className="font-bold text-lg my-5">Size:</h3>
                    <div className="flex items-center gap-2 flex-wrap ">
                        {productData?.sizes?.map((item: string, index: number) => (
                            <Badge key={item + index} className="flex items-center justify-center px-4 text-sm py-2 rounded-lg border shadow-md w-fit">
                                {item}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="">
                    <h3 className="font-bold text-lg my-5">Tags:</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        {productData?.tags?.map((tage: string, index: number) => (
                            <Badge key={tage + index} className="flex items-center justify-center text-sm px-4 py-2 rounded-lg border shadow-md w-fit">
                                {tage}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="">
                    <h3 className="font-bold text-lg my-5">Colors:</h3>
                    <div className="flex items-center gap-2 flex-wrap">
                        {productData?.colors?.map((color: string, index: number) => (
                            <Badge key={color + index} className="flex items-center justify-center px-4 text-sm py-2 rounded-lg border shadow-md w-fit">
                                {color}
                            </Badge>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg my-5">Category:</h3>
                    <div className="flex items-center gap-2 flex-wrap text-sm">
                        {productData?.category}
                    </div>
                </div>
            </section>
            {
                session && (session.role === "Owner"  || session.collectionId === productData.collectionId) && (
                    <section className="flex items-center justify-around my-6">
                <Delete itemId={productData.id} type="product"/>
                <Link
                    href={`/products/update-product/${productData.id}`}
                    className={buttonVariants({ variant: "default"})}
                >
                    <Edit2 className="w-4 h-4" /> Edit
                </Link>
            </section>
                )
            } 

            <Link href="/products" className={`${buttonVariants({ variant: "default"})} bg-red-700 text-white hover:bg-red w-fit mx-5`}>Back</Link>
            
            {/* <Reviews productId={productData?._id}/> */}
        </>
    );
};

export default ProductDetails;