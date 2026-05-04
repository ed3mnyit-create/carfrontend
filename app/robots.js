export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard/", "/booking/", "/auth/", "/api/", "/admin/"],
      },
    ],
    sitemap: "https://c4rplatform.com/sitemap.xml",
  };
}
