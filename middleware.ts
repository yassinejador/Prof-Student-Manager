import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
 const token = req.cookies.get("token")?.value;
 const path = req.nextUrl.pathname;

 // Exclure les routes API du middleware
 if (path.startsWith("/api")) {
  return NextResponse.next();
}

 if (token && path === "/auth") {
   return NextResponse.redirect(new URL("/", req.url));
 }

 if (path === "/auth") {
   return NextResponse.next();
 }

 if (!token) {
   return NextResponse.redirect(new URL("/auth", req.url));
 }

 return NextResponse.next();
}

export const config = {
 matcher: ["/((?!api|_next/static|_next/image|icon.png|images/logo.*).*)",],
};