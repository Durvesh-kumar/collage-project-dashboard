"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import React, { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/helpers/UserRole";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .email(),
  id: z.string(),
  role: z.string(),
});

interface Propes {
  open: boolean;
  setOpen: (value: boolean) => void;
  userEmail: string;
  userId: string;
}

const DialogUser: React.FC<Propes> = ({ open, setOpen, userEmail, userId }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: userEmail,
      id: userId,
      role: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter()
  const {data:session} = useSession()

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if(session && (session.role === "OWNER")){
       const res = await fetch("/api/users",{
        method: "PATCH",
        cache: "no-store",
        body: JSON.stringify(values)
       });

       const data = await res.json();

       if(data.error){
         toast.error(data.message);
         setOpen(!open)
         setLoading(false)
       }

       if(data.success){
        toast.success(data.message);
        router.push("/users")
        setOpen(!open)
        setLoading(false)
       }

    }
  }

  const handelKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Update user rola</DialogTitle>
          <DialogDescription>
            Make changes to your user role here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {UserRole?.map((item) => (
                          <SelectItem key={item.id} value={item.name} onKeyDown={handelKeyPress} className={`${session && (session?.role === "OWNER") && "cursor-pointer hover:bg-slate-500"}`}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email:</FormLabel>
                  <FormControl>
                    <Input
                      onKeyDown={handelKeyPress}
                      {...field}
                      defaultValue={userEmail}
                      readOnly
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <Button
                disabled={loading}
                type="reset"
                onClick={() => setOpen(!open)}
                className="bg-red-700 text-white"
              >
                Cancel
              </Button>
              <Button disabled={loading} type="submit">{loading ? <LoaderCircle size={48} className="w-6 h-6 animate-spin"/> : "Apply"}</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DialogUser;