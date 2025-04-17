"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";

// Extend the Session type to include the 'role' property
declare module "next-auth" {
  interface Session {
    role?: string;
    collectionId?: string; // Add collectionId property
  }
};

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { UploadImage } from "@/components/coustemUI/UploadImage";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2).max(300),
  image: z.string(),
  state: z.string().min(3),
  city: z.string().min(3),
  phoneNo: z.string().min(9).max(10),
  address: z.string().min(5),
  pinCode: z.string().min(4).max(6),
  country: z.string(),
});

interface Propes {
  initialData?: CollectionType | null;
}

export const CollectionForm: React.FC<Propes> = ({ initialData }) => {

  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
          title: "",
          image: "",
          state: "",
          description: "",
          phoneNo: "",
          address: "",
          pinCode: "",
          city: "",
          country: "India",
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    
      const url = initialData ? `/api/collections/${initialData.id}` : "/api/collections"
       const res = await fetch(url, {
         method: initialData ? "PATCH" : "POST",
         body: JSON.stringify(values)
       });

       const data = await res.json();

       if(data.success){
        toast.success(data.message)
        router.push("/collections")
        setLoading(false)
       }
       if(data.error){
        setLoading(false)
        toast.error(data.message)
       }
  }

  const handelKeyPress = (
    e:
      | React.KeyboardEvent<HTMLInputElement>
      | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <div className="mx-10 mt-5">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <section className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-10">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title:</FormLabel>
                <FormControl>
                  <Input
                    onKeyDown={handelKeyPress}
                    placeholder="Please enter title ..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country:</FormLabel>
                  <FormControl>
                    <Input onKeyDown={handelKeyPress} defaultValue={"India"} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State:</FormLabel>
                  <FormControl>
                    <Input onKeyDown={handelKeyPress} placeholder="Please enter state...." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City:</FormLabel>
                  <FormControl>
                    <Input onKeyDown={handelKeyPress} placeholder="Please enter your city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pin code:</FormLabel>
                  <FormControl>
                    <Input onKeyDown={handelKeyPress} type="number" placeholder="Pleace enter pin code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone no:</FormLabel>
                  <FormControl>
                    <Input onKeyDown={handelKeyPress} type="number" placeholder="Please enter your contect number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
        
          </section>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image:</FormLabel>
                <FormControl>
                  <UploadImage
                    type="Collection"
                    value={field.value ? [field.value] : []}
                    onRemove={() => field.onChange("")}
                    onChange={(url) => field.onChange(url)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address:</FormLabel>
                  <FormControl>
                    <Input onKeyDown={handelKeyPress} placeholder="please enter address...." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discription:</FormLabel>
                <FormControl>
                  <Textarea
                  onKeyDown={handelKeyPress}
                    rows={6}
                    placeholder="Please enter discription ......"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-between items-center">
          <Button className="bg-red-600 text-white" onClick={()=> router.push("/collections")} type="reset" disabled={loading}>Cancel</Button>
          <Button type="submit" disabled={loading}>{loading ? <LoaderCircle size={48} className="w-6 h-6 animate-spin"/> : "Submit"}</Button>
          </div>
          
        </form>
      </Form>
    </div>
  );
};