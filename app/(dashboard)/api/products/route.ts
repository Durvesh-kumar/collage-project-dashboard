import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req:NextRequest)=>{
    try {


        const token:any = await auth()
        
        // Validate the token
        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        const userId = token.userId

        if(!userId){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        // Check if the user has the correct role
        if(token.role === "USER"){
            return NextResponse.json({message: "User role is not verified", success: false, error: true}, {status: 403})
        }
 
        // Check if the user has a valid collection ID
        if(!token.collectionId){
            return NextResponse.json(
                { message: "You are not authorized to add products to this collection", success: false, error: true },
                { status: 403 }
            )
        }

        // Parse the request body
        const { title, description, price, pay, tags, sizes, colors, category, media, brand} = await req.json()

        console.log(title, description, price, pay, tags, sizes, colors, category, media, brand);
        


        // Validate required fields
        if (!title || !description || !pay || !price || !tags || !sizes || !colors || !category || !media || !brand) {
            return NextResponse.json({message:'All fields are required', error:true, success:false}, { status: 400 })
        }

        // // Validate required fields
        // if(token.collectionId){
        //     return NextResponse.json(
        //         { message: "You are not authorized to add products to this collection", success: false, error: true },
        //         { status: 403 }
        //     )
        // }

        // Check if a product with the same title already exists in the collection
    //    const existingProduct = await prisma.product.findUnique({
    //     where:{
    //         title
    //     }
    //    });

        // if (existingProduct) {
        //     return NextResponse.json(
        //       { message: "A product with this title already exists in the collection", success: false, error: true },
        //       { status: 409 }
        //     );
        // }

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
              collectionId: token.collectionId,
              media,
              brand,
              userId: userId
            },
          });

          await prisma.collection.update({
            where: {
                id: token.collectionId,
            },
            data: {
                products: {
                    connect: {
                        id: newProduct.id
                    }
                },
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
                collection: true
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