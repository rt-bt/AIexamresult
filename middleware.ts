import { NextResponse, type NextRequest } from "next/server";
import { verifyAccessToken } from "@/lib/server/auth";

export async function middleware(request: NextRequest) {
  if (
    !request.nextUrl.pathname.startsWith("/admin/dashboard") &&
    !request.nextUrl.pathname.startsWith("/admin/ai-generator") &&
    !request.nextUrl.pathname.startsWith("/api/admin")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access_token")?.value;
  if (!token && request.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!token) return NextResponse.redirect(new URL("/admin/login", request.url));

  try {
    await verifyAccessToken(token);
    if (request.nextUrl.pathname.startsWith("/api/admin") && ["POST", "PATCH", "PUT", "DELETE"].includes(request.method)) {
      const csrfCookie = request.cookies.get("csrf_token")?.value;
      const csrfHeader = request.headers.get("x-csrf-token");
      if (!csrfCookie || csrfCookie !== csrfHeader) {
        return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
      }
    }
    return NextResponse.next();
  } catch {
    if (request.nextUrl.pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
