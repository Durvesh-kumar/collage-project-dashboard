"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { doCredentialLogin } from "@/lib/actions/auth";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPassword({setLoading, loading}:{setLoading: (Value: boolean)=> void, loading:boolean}) {

  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const resp = await doCredentialLogin(values);

    if(!!resp.error){
      toast.error(resp.error)
      setLoading(false)
    } else {
      
      toast.success("User successfully login");
      router.push("/")
      setLoading(false);
    }
  }

  const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  return (
    <div className="w-full mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input onKeyDown={handlePressKey} placeholder="Please enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input onKeyDown={handlePressKey} placeholder="Please enter password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
                <div className="flex justify-end">
              
                <button onClick={()=> router.push("/forgot-password/verify-email")} disabled={loading} className="text-blue-400 w-fit hover:text-blue-600">Forgot-password ?</button>
                </div>
            
            
          </div>

          <Button type="submit" disabled={loading} className="w-full">{loading ? <LoaderCircle size={48} strokeWidth={3} className=" animate-spin" /> : "Submit"}</Button>
        </form>
      </Form>
    </div>
  );
}