import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/server/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Security headers for all responses
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");

  // Only check admin auth for admin routes
  const isAdminPage = pathname.startsWith("/admin/dashboard") || pathname.startsWith("/admin/ai-generator");
  const isAdminApi = pathname.startsWith("/api/admin");

  if (!isAdminPage && !isAdminApi) {
    return response;
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token && isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

  try {
    await verifyAccessToken(token);
    if (isAdminApi && ["POST", "PATCH", "PUT", "DELETE"].includes(request.method)) {
      const csrfCookie = request.cookies.get("csrf_token")?.value;
      const csrfHeader = request.headers.get("x-csrf-token");
      if (!csrfCookie || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
      }
    }
    return response;
  } catch {
    if (isAdminApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|apple-touch-icon|icons/|sw.js).*)"]
};
