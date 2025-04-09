"use client";
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { format } from "date-fns";

export const ProductsTable: ColumnDef<ProductType>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <Link
        href={`/products/details-product/${row.original.id}`}
        className="hover:text-blue-500 underline-offset-1"
      >
        {row.original.title}
      </Link>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "pay",
    header: "Pay",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "collection",
    header: "Collection",
    cell: ({ row }) => {

      const collection = row.original.collection

      if(!collection){
        return <span>No Collection</span>
      }

      return(
      <Link
        
        href={`/collections/details-collection/${collection.id}`}
        className="hover:text-blue-500"
      >
        {collection && collection.title}
      </Link>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: "CreatedAt",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return <p>{format(date, "dd MM yyyy")}</p>;
    },
  },
];

export default ProductsTable;