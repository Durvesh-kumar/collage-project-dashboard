"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import CollectionNavbar from "./components/CollectionNavbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [client, setClient] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setClient(true);
  }, []);
  return (
    <div className="flex flex-col">
      {session && session.role === "OWNER" && <CollectionNavbar />}
      {client && <div>{children}</div>}
    </div>
  );
}