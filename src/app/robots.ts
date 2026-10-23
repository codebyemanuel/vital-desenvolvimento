import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/config/vital";
export default function robots(): MetadataRoute.Robots {
  const url = getSiteUrl();
  return { rules: { userAgent: "*", ...(url ? { allow: "/" } : { disallow: "/" }) }, ...(url ? { sitemap: new URL("/sitemap.xml", url).href } : {}) };
}
