import { NextResponse } from "next/server"; 
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
    const token = req.cookies.get("access_token");
    const { pathname } = new URL(req.url);

    if (token && (pathname === "/login" || pathname === "/register")) {
        return NextResponse.redirect(new URL("/home", req.url))
    }

    if (!token && pathname.startsWith("/home")) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/login", "/register", "/home/:path*"]
}