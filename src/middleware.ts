import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const secret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname === "/" ||
    pathname.startsWith("/api/") ||
    pathname === "/login" ||
    pathname.startsWith("/register")
  ) {
    return NextResponse.next();
  }

  const secureCookie = request.url.startsWith("https://");
  const token = await getToken({ req: request, secret, secureCookie });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin guard
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Onboarding redirects
  if (pathname === "/onboarding" && token.onboardedAt) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (
    (pathname.startsWith("/certificate") || pathname.startsWith("/dashboard")) &&
    !token.onboardedAt
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
