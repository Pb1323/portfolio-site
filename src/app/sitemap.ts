import type { MetadataRoute } from "next";

// Set NEXT_PUBLIC_SITE_URL once this is deployed (e.g. in Vercel's env vars) —
// falls back to localhost so this still resolves to something valid pre-deploy.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
