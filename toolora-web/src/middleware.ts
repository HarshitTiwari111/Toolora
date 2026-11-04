import { NextResponse, type NextRequest } from "next/server";

// /admin ke saare pages login ke peeche. Token ki asli jaanch API karti hai.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLogin = pathname === "/admin/login" || pathname === "/admin/login/";
  const hasToken = Boolean(req.cookies.get("toolora_admin")?.value);

  if (!isLogin && !hasToken) {
    return NextResponse.redirect(new URL("/admin/login/", req.url));
  }
  if (isLogin && hasToken) {
    return NextResponse.redirect(new URL("/admin/", req.url));
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = { matcher: ["/admin", "/admin/:path*"] };
