"use client"
import React, { useState } from 'react'
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns";
import { useSession } from 'next-auth/react';
import DialogUser from './DialogUser';
import Link from 'next/link';


interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  collections: [CollectionType]
}


const RoleCell: React.FC<{ role: string; userId: string; userEmail: string }> = ({
  role,
  userId,
  userEmail,
}) => {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`${
        session && session.role === "OWNER" && "hover:text-blue-500 cursor-pointer"
      }`}
      onClick={() => {
        if (session && session.role === "OWNER") {
          setOpen(!open);
        }
      }}
    >
      <p>{role}</p>
      {open && (
        <DialogUser open={open} setOpen={setOpen} userId={userId} userEmail={userEmail} />
      )}
    </div>
  );
};

export const UsersTable: ColumnDef<UserType>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "collections",
        header: "Collection",
        cell: ({ row })=> {
            const title = row.original.collections.map((item)=> item.title);
            const id = row.original.collections.map((item)=> item.id);

            return(
                <Link href={`/collections/details-collection/${id}`} className='hover:text-blue-500'>{title}</Link>
            )
            
        }
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
          <RoleCell role={row.original.role} userId={row.original.id} userEmail={row.original.email} />
        ),
      },
    {
        accessorKey: "createdAt",
        header: "CreatedAt",
        cell: ({ row })=> {
            const date = new Date(row.original.createdAt);
            return <p>{format(date,"dd MM yyyy")}</p>
        }
    }
  ]

export default UsersTable