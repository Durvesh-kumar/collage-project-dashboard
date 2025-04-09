import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req:NextRequest,{params}:{params: Promise<{collectionId: string}>})=>{
   try {

    const collectionId = (await params).collectionId

    if(!collectionId){
        return NextResponse.json({message: "Collection not found", success:false, error: true}, {status: 404})
    }

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

    const products = await prisma.product.findMany({
        where:{
            collectionId
        },
        orderBy:{
            createdAt: "desc"
        }
    });

    if(!products){
        return NextResponse.json({message: "Product not found", success: false, error: true}, {status: 404})
    }

    return NextResponse.json({message: "", products, success: true, error:false}, {status: 200})
    
   } catch (error) {
    console.log("[dashboard > api > collections > products > collectionId_GET]", error);
    return new NextResponse("Internal Server Error", {status: 500})
   }
}