import { prisma } from "@/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async()=>{
    try {
        const collections = await prisma.collection.findMany({
            orderBy:{
                createdAt: "desc"
            }
        })
        

        if(!collections || collections.length === 0){
            return NextResponse.json({message: "No collections found", success: false, error: true}, {status: 404})
        }

            // Return the collections with a 200 status
        return NextResponse.json(
           { message: "Collections fetched successfully", collections, success: true, error: false },
           { status: 200 }
        );
  
        
    } catch (error) {
        console.log("[dashboard > api > collections > all-collections_GET]", error);
        return new NextResponse("Internal Server Error", {status: 500})
        
    }
}



export const POST = async(req:NextRequest)=>{
    try {
        const secret = process.env.AUTH_SECRET!

        const token = await getToken({ req, secret }) as { collectionId?: string; isVerified?: boolean; role?: string; sub?: string } | null;

        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        if(token.collectionId){
            return NextResponse.json({message: `User already created Collection id: ${token.collectionId} and find on collections page`, success: false, error:true}, {status:401});
        }

        if(token.isVerified === false){
            return NextResponse.json({message: "User not found", success: false, error:true}, {status:401});
        }

        if (token.role === "USER") {
            return NextResponse.json({ message: "User role not Verified", error: true, success: false }, { status: 400 });
        };

        const findUser = await prisma.user.findUnique({
            where:{
                id: token.sub
            }
        });

        if (findUser?.collectionId) {
            return NextResponse.json({ message: `User already created Collection id: ${findUser.collectionId.toString()} and find on collections page`, error: true, success: false }, { status: 400 })
        }

        const { title, description, image, state, city, country = "India", phoneNo, pinCode, address } = await req.json();

        if(!title || !description || !image || !state || !city || !country || !phoneNo || !pinCode || !address){
            return NextResponse.json({message: "All fieds are required", success: false, error:true}, {status: 404});
        }

        const findTitle = await prisma.collection.findUnique({
            where:{
                title
            }
        })

        if(findTitle){
            return NextResponse.json({message: "Collection title is already exist", success: false, error:true}, {status: 404});
        }

        const collection = await prisma.collection.create({
            data :{
                title,
                description,
                state,
                city,
                country,
                phoneNo,
                pinCode,
                image,
                address,
                userId: findUser?.id
                
            }
        });

        await prisma.user.update({
            where:{
                id: findUser?.id
            },
            data:{
                collectionId: collection.id,

                collections:{
                    connect: {
                        userId: findUser?.id
                    }
                }
            }
        });

        return NextResponse.json({message: "Collection create a successfully", success:true, error:false}, {status: 200})

        
    } catch (error) {
        console.log("[api > collections > create-collection_POST]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}