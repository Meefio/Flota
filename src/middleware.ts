import { auth } from "@/lib/auth.config";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  // Public routes
  if (pathname === "/login") {
    if (isLoggedIn) {
      const redirectTo = role === "admin" ? "/admin" : "/kierowca";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    return NextResponse.next();
  }

  // Require auth for all other routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based access
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/kierowca", req.url));
  }
  if (pathname.startsWith("/kierowca") && role !== "driver") {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Root redirect
  if (pathname === "/") {
    const redirectTo = role === "admin" ? "/admin" : "/kierowca";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
