import { auth } from "@/auth";
import Delete from "@/components/coustemUI/Delete";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function DetailsCollections({
  collection,
}: {
  collection: CollectionType;
}) {
  const session = await auth();
  return (
    <div className="flex flex-col m-2">
      <div className="my-4 flex items-center justify-end">
        {session && session.role === "OWNER" && (
          <Link
            href={`/collections/owner-collection-products/${collection.id}`}
            className={`${buttonVariants({
              variant: "default",
            })} bg-blue-600 text-white hover:bg-slate-400`}
          >
            Show products
          </Link>
        )}
      </div>
      <div className="text-center text-4xl my-5 font-bold">
        {collection.title}
      </div>

      <hr className="h-1 bg-blue-500 rounded-full" />

      <div className="flex items-center justify-center my-5">
        <Image
          src={collection.image}
          alt={collection.title}
          width={1000}
          height={1000}
          className="w-[420px] h-[420px]"
        />
      </div>

      <section className="m-5 flex flex-col gap-5">
        <div className="flex items-center justify-around">
          <div className=" flex flex-col gap-5 justify-start">
            <div className="flex gap-3">
              <h1 className="text-lg font-bold">State:</h1>
              <p>{collection.state}</p>
            </div>
            <div className="flex gap-3">
              <h1 className="text-lg font-bold">Pin-code:</h1>
              <p>{collection.pinCode}</p>
            </div>
            {session &&
              (session.collectionId === collection.id ||
                session.role === "OWNER") && (
                <div className="flex gap-3">
                  <h1 className="text-lg font-bold">Phone no.</h1>
                  <p>{collection.phoneNo}</p>
                </div>
              )}
          </div>
          <div className="m-5 flex flex-col gap-5">
            <div className="flex gap-3">
              <h1 className="text-lg font-bold">City:</h1>
              <p>{collection.city}</p>
            </div>

            <div className="flex gap-3">
              <h1 className="text-lg font-bold">Country:</h1>
              <p>{collection.country}</p>
            </div>

            {session &&
              (session.collectionId === collection.id ||
                session.role === "OWNER") && (
                <div className="flex gap-3">
                  <h1 className="text-lg font-bold">Totle products:</h1>
                  <p>{collection.products?.length || 0}</p>
                </div>
              )}
          </div>
        </div>

        <div>
          <h1 className="text-lg font-bold">Address:</h1>
          <p className="mt-3">{collection.address}</p>
        </div>

        <div>
          <h1 className="text-lg font-bold">Description:</h1>
          <p className="mt-3 text-muted-foreground">{collection.description}</p>
        </div>

        {session &&
          (session.collectionId === collection.id ||
            session.role === "OWNER") && (
            <div className="flex items-center justify-around mt-8">
              <Delete itemId={collection.id} type="Collection" />
              <Link
                className={buttonVariants({ variant: "default" })}
                href={`/collections/edit/${collection.id}`}
              >
                Edit
              </Link>
            </div>
          )}
      </section>

      <Link
        className={`${buttonVariants({
          variant: "default",
        })} bg-orange-700 w-fit text-white mx-8 hover:bg-orange-500`}
        href={"/collections"}
      >
        Back
      </Link>
    </div>
  );
}