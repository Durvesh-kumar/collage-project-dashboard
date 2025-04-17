import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const token = await req.cookies.get('next-auth.session-token')?.value || ""

    const path = req.nextUrl.pathname
    const isPublicPath = path === '/login' || path === '/register' || path === '/verifyemail';

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL("/", req.nextUrl));
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }


}

export const config = {
    matcher: [
        '/login', '/register', '/verifyemail, "/products/new', "/products/edit",
        "/collections/new", "/collections/edit", "/api/collections/DELETE",
        "/api/products/DELETE", "/api/users/PATCH"
    ]
}
export const dynamic = "force-dynamic";