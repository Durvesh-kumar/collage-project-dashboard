import { prisma } from "@/prisma";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


export const GET = async()=>{
    try {

        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc"
            },
            where: {
                isVerified: true
            },
            include: {
                collections: {
                    select: {
                        title: true, // Fetch only the title of the collection
                        id: true
                    }
                }
            }
        });

        if(!users){
            return NextResponse.json({message: "Users not found", error: true, success:false}, {status: 404})
        }
        
        return NextResponse.json({message: "", users, error:false, success:true}, {status: 200})

        
    } catch (error) {
        console.log("[dashboard > api > users_GET]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}


// update user role
export const POST = async(req:NextRequest)=>{
    try {
        const secret = process.env.AUTH_SECRET!
        const token = await getToken({ req, secret }) as { collectionId?: string; isVerified?: boolean; role?: string; sub?: string } | null;
                
        if(!token){
            return NextResponse.json({message: "Invalid user", success: false, error:true}, {status:401});
        }

            const {email, id, role} = await req.json();

            if(!email || !id || !role){
                return NextResponse.json({message: "All fields are reqired", error: true, success: false}, {status: 403})
            }

            if(token.role === "OWNER"){

                const findUser = await prisma.user.findUnique({
                    where:{
                        id
                    }
                });

                console.log(findUser);
                
        
                if(!findUser){
                    return NextResponse.json({message: "User not found", error:true, success: false}, {status: 404})
                }
        
                if(email !== findUser?.email){
                   return NextResponse.json({message: "Invalid user", error: true, success: false}, {status: 403})
                }

                await prisma.user.update({
                    where:{
                        id: findUser.id
                    },
                    data:{
                        role
                    }
                });
    
                return NextResponse.json({message: "User update successfully", error:false, success: true}, {status: 200})
            }

        return NextResponse.json({message: "You are not authorized to update this user", success: false, error: true}, {status: 401});

    } catch (error) {
        console.log("[dashboard > api > users > POST]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}