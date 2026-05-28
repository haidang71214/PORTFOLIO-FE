import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get("host") || "";

  // Parse admin hosts from env
  const adminHostsEnv =
    process.env.NEXT_PUBLIC_ADMIN_HOSTS || "admin.localhost,admin.lawoh.click";
  const adminHosts = adminHostsEnv.split(",").map((h) => h.trim());

  // Clean host (remove port if any, e.g., admin.localhost:3000 -> admin.localhost)
  const cleanHost = host.split(":")[0];
  const isAdminSubdomain = adminHosts.includes(cleanHost);

  if (isAdminSubdomain) {
    const cookieName =
      process.env.NEXT_PUBLIC_ACCESS_TOKEN ||
      "portfolio_access_tadasdasdazxzxczxcken";
    const hasToken = request.cookies.has(cookieName);

    // 1. If accessing auth paths
    if (url.pathname.startsWith("/auth")) {
      if (url.pathname === "/auth/login") {
        if (hasToken) {
          url.pathname = "/";
          return NextResponse.redirect(url);
        }
        url.pathname = "/auth/admin-login";
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    // 2. If not logged in
    if (!hasToken) {
      url.pathname = "/auth/login";
      return NextResponse.redirect(url);
    }

    // 3. If logged in, block user-only paths
    if (url.pathname.startsWith("/manager/portfolio")) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }

    // 4. Rewrite remaining paths to /admin/
    if (!url.pathname.startsWith("/admin")) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
