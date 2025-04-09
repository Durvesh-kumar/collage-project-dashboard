import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req:NextRequest, {params}:{params: Promise<{collectionId: string}>})=>{
    try {

        const collectionId = (await params).collectionId;

        const collection = await prisma.collection.findUnique({
            where:{
                id: collectionId
            },
        });

        if(!collection){
            return NextResponse.json({message: "Colllection not found", success: false, error: true}, {status: 404})
        }

        return NextResponse.json({mrssage: "Collection update successfully", collection , success:true, error:false}, {status: 200});
        

    } catch (error) {
        console.log("[api > collections > collectionId_GET", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}


export const PATCH = async(req:NextRequest, {params}:{params: Promise<{collectionId: string}>})=>{
    try {
        const secret = process.env.AUTH_SECRET!
        const token = await getToken({ req, secret }) as { collectionId?: string; isVerified?: boolean; role?: string; sub?: string } | null;
        
        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        const collectionId = (await params).collectionId

        const { title, description, image, state, city, country = "India", phoneNo, pinCode, address } = await req.json();

        if(!title || !description || !image || !state || !city || !country || !phoneNo || !pinCode || !address){
            return NextResponse.json({message: "All fieds are required", success: false, error:true}, {status: 404});
        }


        if(token.role === "OWNER" || collectionId === token.collectionId){
            const findCollection = await prisma.collection.findUnique({
                where:{
                    id: collectionId
                }
            });

            if(!findCollection){
                return NextResponse.json({message: "Collection not found", error: true, success: false}, {status: 404})
            }

            await prisma.collection.update({
                where:{
                    id: findCollection.id
                },
                data:{
                    title, description, image, state, city, country, phoneNo, pinCode, address
                }
            });

            return NextResponse.json({message: "Collection update successfully", error: false, success: true}, {status: 200})
        } else {
            return NextResponse.json({message: "Invalid collecion user", success: false, error: true}, {status: 400})
        }
        
        
    } catch (error) {
        console.log("[api> collections > collectionId_POST", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}

export const DELETE = async(req:NextRequest, {params}:{params: Promise<{collectionId: string}>})=> {
    try {

        const collectionId = (await params).collectionId

        if(!collectionId){
            return NextResponse.json({message: "Collection is not found", success: false, error: true}, {status: 404})
        }

        const secret = process.env.AUTH_SECRET!
        const token = await getToken({ req, secret }) as { collectionId?: string; isVerified?: boolean; role?: string; sub?: string } | null;
        
        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

        if(!token.collectionId || token.role === "USER"){
            return NextResponse.json({message: "You are not authorized to update this product", success: false, error: true}, {status: 401});
        }

        if(token.role === "OWNER" || token.collectionId === collectionId){
            const findCollection = await prisma.collection.findUnique({
                where:{
                    id: collectionId
                }
            });

            if(!findCollection){
                return NextResponse.json({message: "Collection not found", error:true, success: false}, {status: 404})
            }

            if(findCollection){
                await prisma.product.deleteMany({
                    where:{
                        collectionId: findCollection.id
                    }
                });
                await prisma.collection.delete({
                    where:{
                        id: findCollection.id
                    }
                });

                await prisma.user.update({
                    where:{
                        id: token.sub!
                    },
                    data: {
                        collectionId: null
                    }
                });

                return NextResponse.json({message: "Collection deleted successfully", error: false, success: true}, {status: 200})
            }

        }

        return NextResponse.json({message: "Collection not found", error: true, success: false}, {status: 404})
        
    } catch (error) {
        console.log("[api > collections > collectionId_DELETE", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}