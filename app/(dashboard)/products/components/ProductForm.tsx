"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";

// Extend the Session type to include the 'role' property
declare module "next-auth" {
  interface Session {
    role?: string;
    collectionId?: string; // Add collectionId property
  }
};

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
import { IndianRupee, LoaderCircle } from "lucide-react";
import { categories } from "@/helpers/Categories";
import { useEffect, useState } from "react";
import { UploadImage } from "@/components/coustemUI/UploadImage";
import MultiSelects from "@/components/coustemUI/MultiSelects";
import MultiTexts from "@/components/coustemUI/MultiTexts";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title must be at least 2 characters.",
  }).max(30),

  description: z.string().min(100),
  price: z.coerce.number().min(10).max(300000),
  pay: z.coerce.number().min(10).max(300000),
  brand: z.string().min(3).max(20),
  category: z.string().min(3),
  colors: z.array(z.string().min(2).max(20)).min(1, {
    message: "Color must be required !.",
  }),
  sizes: z.array(z.string().min(2).max(10)),
  media: z.array(z.string().url()).min(1, {
    message: "Image must be required !.",
  }),
  tags: z.array(z.string().min(2).max(20)).min(1, {
    message: "Tag must be required !.",
  }),
  ownerCollection: z.string().optional()
})

interface Propes {
  initialData?: ProductType | null
}

export const ProductForm: React.FC<Propes> = ({ initialData }) => {

    const { data: session } = useSession();
    const collectionId = session && (session.collectionId);

    const router = useRouter();
    const [collections, setCollections] = useState<CollectionType[]>([]);
    const [loading, setLoading] = useState(false)

  

    const fetchCollections = async ()=>{
      const res = await fetch("/api/collection/all-collections", {
        method: "GET",
      });

      if(!res.ok){
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-red-500">Error fetching collections. Please try again later.</p>
          </div>
        );
      }

      const data = await res.json();

      if(data.success){
        setCollections(data.collections);
      }
    }

    useEffect(() => {
        const isOwner = session && session.role === "OWNER"; // Extract the complex expression
        if (isOwner) {
          fetchCollections();
        }
      }, [session]); // Use the simpler variable or session as the dependency

  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? { ...initialData }
      : {
        title: '',
        description: '',
        ownerCollection: "",
        price: 10,
        pay: 10,
        brand: '',
        sizes: [],
        colors: [],
        media: [],
        category: '',
        tags: []
        },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    
      setLoading(true)
      const url = initialData ? `/api/products/${initialData.id}` : "/api/products"

      console.log(url);
      
       const res = await fetch(url, {
         method: initialData ? "PATCH" : "POST",
         body: JSON.stringify(values)
       });

       const data = await res.json();

       if(data.success){
        router.push("/products")
        toast.success(data.message)
        setLoading(false)
       }
       if(data.error){
        toast.error(data.message)
        setLoading(false);
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
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    onKeyDown={handelKeyPress}
                                    placeholder="Please enter title...." {...field} />
                            </FormControl>
                            <FormMessage className=" text-sm text-orange-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discription</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={6}
                                    onKeyDown={handelKeyPress}
                                    placeholder="Please enter description...." {...field} />
                            </FormControl>
                            <FormMessage className=" text-sm text-orange-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <UploadImage
                                    type="Product"
                                    value={field.value}
                                    onChange={(url) => field.onChange(field.value = [...field.value, url])}
                                    onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])}
                                />
                            </FormControl>
                            <FormMessage className=" text-sm text-orange-500" />
                        </FormItem>
                    )}
                />
                <section className="grid items-center gap-8 md:grid-cols-2 xl:grid-rows-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-rows-4 sm:grid-cols-1 w-full ">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><span>Price</span><IndianRupee className="w-4 h-4" /></FormLabel>
                                <FormControl>
                                    <Input type="number" min={10} placeholder="Please Enter price" onKeyDown={handelKeyPress} {...field} className="w-full" />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><span>Pay</span><IndianRupee className="w-4 h-4" /></FormLabel>
                                <FormControl>
                                    <Input type="number" min={10} placeholder="Please Enter pay" onKeyDown={handelKeyPress} {...field} className="w-full" />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Please Enter product brand" onKeyDown={handelKeyPress} {...field} className="w-full" />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {
                                                categories?.map((category) => (
                                                    <SelectItem value={category.name} key={category.id} className="hover:cursor-pointer hover:text-black hover:bg-slate-400">{category.name}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>

                                    </SelectContent>
                                </Select>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    {
                      session &&(session.role === "OWNER") && (
                        <FormField
                        name="ownerCollection"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Collection</FormLabel>
                                <FormControl>
                                  <MultiSelects
                                    values={field.value ? [field.value] : []}
                                    onChange={(select: string) => field.onChange(select)}
                                    placeholder="Please select collection"
                                    collections={collections}
                                    onRemonve={() => field.onChange('')}
                                  />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                      )
                    }
                    
                    <FormField
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sizes</FormLabel>
                                <FormControl>
                                    <MultiTexts
                                        values={field.value}
                                        onChange={(text) => field.onChange([...field.value, text])}
                                        onRemove={(text) => field.onChange([...field.value.filter((item => item !== text))])}
                                        placeholder='Please enter sizes'
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="colors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Colors</FormLabel>
                                <FormControl>
                                    <MultiTexts
                                        values={field.value}
                                        onChange={(text) => field.onChange([...field.value, text])}
                                        onRemove={(text) => field.onChange([...field.value.filter((item => item !== text))])}
                                        placeholder='Please enter colors'
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <MultiTexts
                                        values={field.value}
                                        onChange={(text) => field.onChange([...field.value, text])}
                                        onRemove={(text) => field.onChange([...field.value.filter((item => item !== text))])}
                                        placeholder='Please enter tags'
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                </section>
                <div className="flex item-center justify-around">
                    <Button
                        onClick={() => router.push('/products')}
                        disabled={loading}
                        className="bg-red-500 text-white border hover:bg-white hover:text-black hover:border-black" type="button">
                        Back
                    </Button>
                    <Button disabled={loading} type="submit">{loading ? <LoaderCircle size={48} className="w-6 h-6 animate-spin"/> : "Submit"}</Button>
                </div>
            </form>
        </Form>
    </div>
  );
};