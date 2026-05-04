import { NextResponse } from "next/server";
import {
  AUTH_TOKEN_COOKIE,
  clearAuthCookies,
  postToBackend,
} from "@/lib/authSession";

export async function POST(request) {
  const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  if (token) {
    try {
      await postToBackend("/auth/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch {
      // Clear local auth state even if the upstream logout request fails.
    }
  }

  return clearAuthCookies(
    NextResponse.json({
      success: true,
      message: "تم تسجيل الخروج بنجاح",
    }),
  );
}
