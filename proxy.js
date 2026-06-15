import { NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE,
  applyAuthCookies,
  clearAuthCookies,
  fetchSessionFromToken,
} from "@/lib/authSession";

const buildLoginRedirect = (request) => {
  const loginUrl = new URL("/auth/login", request.url);
  const returnUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;

  loginUrl.searchParams.set("returnUrl", returnUrl);

  return loginUrl;
};

const redirectToLogin = (request) => {
  const response = NextResponse.redirect(buildLoginRedirect(request));
  return clearAuthCookies(response);
};

export async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isUserRoute = pathname.startsWith("/dashboard/user");
  const isBookingRoute = pathname.startsWith("/booking");

  if (!isAdminRoute && !isUserRoute && !isBookingRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return redirectToLogin(request);
  }

  const session = await fetchSessionFromToken(token);

  if (!session.success) {
    return redirectToLogin(request);
  }

  const role = session.user.role;

  if (isAdminRoute && role !== "admin") {
    const response = NextResponse.redirect(new URL("/dashboard/user", request.url));
    return applyAuthCookies(response, { token, role });
  }

  if (isUserRoute && role === "admin") {
    const response = NextResponse.redirect(new URL("/dashboard/admin", request.url));
    return applyAuthCookies(response, { token, role });
  }

  const response = NextResponse.next();
  return applyAuthCookies(response, { token, role });
}

export const config = {
  matcher: ["/dashboard/admin/:path*", "/dashboard/user/:path*", "/booking/:path*"],
};
