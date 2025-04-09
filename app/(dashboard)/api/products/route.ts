import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req:NextRequest)=>{
    try {

        const secret = process.env.AUTH_SECRET!

        // Get the token from the request
        const token = await getToken({ req, secret }) as { collectionId?: string; isVerified?: boolean; role?: string; sub?: string } | null;
        
        // Validate the token
        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        // Check if the user has the correct role
        if(token.role === "USER"){
            return NextResponse.json({message: "User role is not verified", success: false, error: true}, {status: 403})
        }
 
        // Check if the user has a valid collection ID
        if(!token.collectionId){
            return NextResponse.json({message: "Invalid user", success: false, error: true}, {status: 403})
        }

        // Parse the request body
        const { title, description, price, pay, tags, sizes, colors, category, collections, media, brand} = await req.json()

        // Validate required fields
        if (!title || !description || !pay || !price || !tags || !sizes || !collections || !colors || !category || !media || !brand) {
            return NextResponse.json({message:'All fields are required', error:true, success:false}, { status: 400 })
        }

        // Validate required fields
        if(token.collectionId !== collections){
            return NextResponse.json(
                { message: "You are not authorized to add products to this collection", success: false, error: true },
                { status: 403 }
            )
        }

        // Check if a product with the same title already exists in the collection
       const existingProduct = await prisma.product.findFirst({
        where: {
          title,
          collectionId: collections,
        },
        });

        if (existingProduct) {
            return NextResponse.json(
              { message: "A product with this title already exists in the collection", success: false, error: true },
              { status: 409 }
            );
        }

        const newProduct = await prisma.product.create({
            data: {
              title,
              description,
              price,
              pay,
              tags,
              sizes,
              colors,
              category,
              collectionId: collections,
              media,
              brand,
              userId: token.sub ?? "", // Ensure userId is always a string
            },
          });

          await prisma.collection.update({
            where: {
                id: collections,
            },
            data: {
                products: {
                    connect: {
                        id: newProduct.id
                    }
                }
            }
          });

          return NextResponse.json(
            { message: "Product created successfully", success: true, product: newProduct },
            { status: 200 }
          );

        
    } catch (error) {
        console.log("[api > products > POST", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

export const GET = async()=>{
    try {
        const products = await prisma.product.findMany({
            orderBy: {
                createdAt: "desc"
            },
            include:{
                collection:{
                    select:{
                        title: true,
                        id: true
                    }
                }
            }
        })

        if(!products){
            return NextResponse.json({message: "Products not found", success: false, error: true}, {status: 404})
        };

        return NextResponse.json({message: "Products found", success: true, products, error: false}, {status: 200})
        
    } catch (error) {
        console.log("[dashboard > api > products > GET", error);
        return new NextResponse("Internal Server Error", {status: 500});
    }
}