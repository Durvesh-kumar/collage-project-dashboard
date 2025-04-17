"use client";
import { logOut } from '@/lib/actions/auth';
import { LogOut } from 'lucide-react';
import React from 'react'

export default function LogoutButton() {
  return <div className='flex gap-2 items-center text-center' onClick={()=> logOut()}>LogOut <LogOut /></div>
}