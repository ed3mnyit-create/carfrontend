import { NextResponse } from "next/server";
import {
  applyAuthCookies,
  clearAuthCookies,
  postToBackend,
} from "@/lib/authSession";

export async function POST(request) {
  let credentials;

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid login payload",
      },
      { status: 400 },
    );
  }

  try {
    const { response, data } = await postToBackend("/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const payload = data || {
      success: false,
      message: "Unexpected login response",
    };

    const nextResponse = NextResponse.json(payload, {
      status: response.status || 500,
    });

    if (!response.ok || !payload?.success) {
      return clearAuthCookies(nextResponse);
    }

    const token = payload?.data?.token;
    const role = payload?.data?.user?.role;

    if (!token || !role) {
      return clearAuthCookies(
        NextResponse.json(
          {
            success: false,
            message: "Incomplete login session data",
          },
          { status: 500 },
        ),
      );
    }

    return applyAuthCookies(nextResponse, { token, role });
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "تعذر الاتصال بالخادم. الرجاء المحاولة لاحقاً.",
      },
      { status: 500 },
    );
  }
}
