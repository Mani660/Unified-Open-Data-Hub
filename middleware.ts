import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Check both demo cookie and NextAuth session cookie
  const isDemoLoggedIn = req.cookies.has("dv_auth");
  const isNextAuthLoggedIn =
    req.cookies.has("next-auth.session-token") ||
    req.cookies.has("__Secure-next-auth.session-token");

  const isLoggedIn = isDemoLoggedIn || isNextAuthLoggedIn;

  // Redirect root: show login first, then send users into the main page after login.
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/api"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  // Not logged in → redirect to login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.ico$).*)"]
};
