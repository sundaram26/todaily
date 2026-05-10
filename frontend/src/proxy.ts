import { NextRequest, NextResponse } from "next/server";

const PUBLIC_AUTH_ROUTES = [
  "/login",
  "/register",
  "/verify-email",
  "/send-verify",
];

const PROTECTED_ROUTES = ["/home", "/dashboard", "/settings", "/profile"];

export function proxy(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  const { pathname } = req.nextUrl;

  // Redirect authenticated users away from auth pages
  if (
    token &&
    PUBLIC_AUTH_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(route + "/"),
    )
  ) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // Protect private routes
  const isProtectedRoute = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/"),
  );

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico).*)"],
};
