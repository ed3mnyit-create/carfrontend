export const AUTH_TOKEN_COOKIE = "token";
export const AUTH_ROLE_COOKIE = "userRole";
export const AUTH_ACTIVE_HINT = "c4r_auth_active";
const LEGACY_AUTH_ROLE_COOKIE = "c4r_role";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://c4r-platform-backend.vercel.app/api";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const isProduction = process.env.NODE_ENV === "production";

export const tokenCookieOptions = {
  httpOnly: false,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

export const roleCookieOptions = {
  httpOnly: false,
  sameSite: "lax",
  secure: isProduction,
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

const parseJsonSafely = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

export const applyAuthCookies = (response, { token, role }) => {
  if (token) {
    response.cookies.set(AUTH_TOKEN_COOKIE, token, tokenCookieOptions);
  }

  if (role) {
    response.cookies.set(AUTH_ROLE_COOKIE, role, roleCookieOptions);
    response.cookies.set(LEGACY_AUTH_ROLE_COOKIE, "", {
      ...roleCookieOptions,
      maxAge: 0,
    });
  }

  return response;
};

export const clearAuthCookies = (response) => {
  response.cookies.set(AUTH_TOKEN_COOKIE, "", {
    ...tokenCookieOptions,
    maxAge: 0,
  });
  response.cookies.set(AUTH_ROLE_COOKIE, "", {
    ...roleCookieOptions,
    maxAge: 0,
  });
  response.cookies.set(LEGACY_AUTH_ROLE_COOKIE, "", {
    ...roleCookieOptions,
    maxAge: 0,
  });

  return response;
};

export const fetchSessionFromToken = async (token) => {
  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Not authorized, no token provided",
    };
  }

  try {
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await parseJsonSafely(response);

    if (!response.ok || !data?.success || !data?.data?.role) {
      return {
        success: false,
        status: response.status || 401,
        message: data?.message || "Failed to validate session",
      };
    }

    return {
      success: true,
      status: response.status,
      user: data.data,
    };
  } catch {
    return {
      success: false,
      status: 500,
      message: "Failed to validate session",
    };
  }
};

export const postToBackend = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    cache: "no-store",
    ...options,
  });

  return {
    response,
    data: await parseJsonSafely(response),
  };
};
