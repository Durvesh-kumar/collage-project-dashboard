"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Circle, LoaderCircle } from "lucide-react";

const FormSchema = z.object({
  email: z
    .string()
    .min(2, {
      message: "Email must be at least 2 characters.",
    })
    .email(),
});

export default function Page() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setLoading(true);
    const res = await fetch("/api/forgot-password/verify-email", {
      method: "POST",
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (data.success) {
      toast.success(data.message);
      router.push(`/forgot-password/${values.email}`);
      setLoading(false);
    }

    if (data.error) {
      toast.error(data.message);
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center flex-col justify-center min-h-screen gap-4">
      <div className="p-5 border-separate border-primary dark:border-blue-500 shadow-sm border-2 rounded-lg">
        <h1 className="text-2xl font-bold text-center my-5">Veryfy Email</h1>
        <section className="grid gap-3 w-full mt-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-6"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email:</FormLabel>
                    <FormControl>
                      <Input
                        className="w-[350px]"
                        placeholder="Please enter emial id ..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>{loading ? <LoaderCircle size={48} strokeWidth={3} className=" animate-spin" /> : "Submit"}</Button>
              </div>
            </form>
          </Form>
        </section>
      </div>
    </div>
  );
}
