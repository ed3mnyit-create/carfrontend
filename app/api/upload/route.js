import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { fetchSessionFromToken, AUTH_TOKEN_COOKIE } from "@/lib/authSession";
import { cookies } from "next/headers";

// Configure Cloudinary
// SECURITY: api_secret must NOT use NEXT_PUBLIC_ prefix — it's server-only
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.NEXT_PUBLIC_CLOUINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || process.env.NEXT_PUBLIC_CLOUINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY || process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET_KEY || process.env.NEXT_PUBLIC_CLOUINARY_API_SECRET_KEY,
});

export async function POST(request) {
  try {
    // 1. Auth Check - Any authenticated user can upload (users need it for booking documents)
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value;
    const session = await fetchSessionFromToken(token);

    if (!session.success) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    // Determine upload folder based on role for organization
    const isAdmin = session.user.role === "admin";
    const uploadFolder = isAdmin ? "car-rental-platform" : "car-rental-platform/user-docs";

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. File Validation (Type, Extension, and Size)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type. Only images are allowed." }, { status: 400 });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const fileName = file.name.toLowerCase();
    if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
      return NextResponse.json({ error: "Invalid file extension. Only image files are allowed." }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }


    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: uploadFolder,
          resource_type: "image",
          transformation: [
            { width: 1200, height: 630, crop: "limit", quality: "auto:good", format: "webp" }
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Upload Error:", error);
    return NextResponse.json(
      { error: "Upload failed: " + error.message },
      { status: 500 }
    );
  }
}
