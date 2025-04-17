"use client";
import { logIn } from "@/lib/actions/auth";
import React from "react";
import { FcGoogle } from "react-icons/fc";

export default function LogInGoogle({loading}:{loading: boolean}) {
  return (
    <button
      type="button"
      disabled={loading}
      onClick={() => logIn("google")}
      className="w-full gap-4 hover:cursor-pointer mt-6 h-6 rounded-md p-4 flex items-center justify-center"
    >
      <div className="flex w-full items-center justify-center gap-4 bg-slate-200 text-slate-800 p-2 rounded-md">
        <FcGoogle />

        <span className="font-medium">Sign in with Google</span>
      </div>
    </button>
  );
}
