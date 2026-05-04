import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_TOKEN_COOKIE } from "@/lib/authSession";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "https://c4r-platform-backend.vercel.app/api";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "No session found" }, { status: 401 });
  }

  try {
    const response = await fetch(`${BACKEND_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, message: data.message || "Session validation failed" }, { status: response.status });
    }

    return NextResponse.json({ success: true, data: data.data });
  } catch (error) {
    return NextResponse.json({ success: false, message: "External API error" }, { status: 500 });
  }
}
