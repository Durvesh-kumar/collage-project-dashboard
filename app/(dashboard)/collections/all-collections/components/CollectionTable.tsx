"use client"
import React from 'react'
import { ColumnDef } from "@tanstack/react-table"
import Link from 'next/link'
import { format } from "date-fns";

export const CollectionTable: ColumnDef<CollectionType>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({row})=> <Link href={`/collections/details-collection/${row.original.id}`} className='hover:text-blue-500 underline-offset-1'>{row.original.title}</Link>

    },
    {
      accessorKey: "products",
      header: "Products",
      cell: ({ row })=> <p>{row.original.products?.length || 0}</p>
    },
    {
        accessorKey: "city",
        header: "City",
      },
    {
      accessorKey: "state",
      header: "State",
    },
    {
      accessorKey: "pinCode",
      header: "PinCode"
    },
    {
      accessorKey: "createdAt",
      header: "CreateAt",
      cell: ({ row })=> {
          const date = new Date(row.original.createdAt);
          return <p>{format(date,"dd MM yyyy")}</p>
      }
    }
    
  ]

export default CollectionTable