import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isAuth = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/signin") || req.nextUrl.pathname.startsWith("/signup");
  const isPublicPage = req.nextUrl.pathname === "/";

  if (isAuthPage) {
    if (isAuth) {
      return NextResponse.redirect(new URL("/home", req.nextUrl));
    }
    return null;
  }

  if (!isAuth && !isPublicPage) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  }

  return null;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
