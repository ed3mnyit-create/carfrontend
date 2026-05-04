const BASE_URL = "https://c4rplatform.com";
const API_URL = "https://c4r-platform-backend.vercel.app/api";

export default async function sitemap() {
  // Static routes
  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/cars`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/individuals`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/with-driver`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/corporate`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/faq`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  // City routes
  const cityRoutes = ["riyadh", "jeddah", "eastern", "sharqiya"].map((city) => ({
    url: `${BASE_URL}/${city}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Dynamic car routes — fetch all cars from API
  let carRoutes = [];
  try {
    const res = await fetch(`${API_URL}/cars`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      const cars = data?.data?.cars || [];
      carRoutes = cars
        .filter((car) => car.slug || car._id)
        .map((car) => ({
          url: `${BASE_URL}/cars/${car.slug || car._id}`,
          lastModified: new Date(car.updatedAt || car.createdAt || Date.now()),
          changeFrequency: "weekly",
          priority: 0.7,
        }));
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch cars", error);
  }

  // Dynamic blog routes — fetch all published blog posts with pagination
  let blogRoutes = [
    {
        url: `${BASE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
    }
  ];
  
  try {
    let page = 1;
    let hasMore = true;
    
    while (hasMore) {
      const res = await fetch(`${API_URL}/blogs?status=published&page=${page}&limit=100&select=slug,_id,updatedAt`, {
        next: { revalidate: 3600 },
      });
      
      if (!res.ok) break;
      
      const { data: blogs, pagination } = await res.json();
      
      blogs
        .filter((blog) => blog.slug || blog._id)
        .forEach((blog) => {
          blogRoutes.push({
            url: `${BASE_URL}/blog/${blog.slug || blog._id}`,
            lastModified: new Date(blog.updatedAt || Date.now()),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        });
      
      hasMore = pagination && pagination.next;
      page++;
    }
  } catch (error) {
    console.error("Sitemap: Failed to fetch blogs", error);
  }

  return [...staticRoutes, ...cityRoutes, ...carRoutes, ...blogRoutes];
}
