import type { MetadataRoute } from "next";
import { getSiteUrl, units } from "@/config/vital";
export default function sitemap(): MetadataRoute.Sitemap {
  const url = getSiteUrl();
  return url ? ["", ...units.map((unit) => unit.slug)].map((slug) => ({ url: new URL(slug, url.href.endsWith("/") ? url : `${url.href}/`).href, changeFrequency: "monthly", priority: slug ? 0.8 : 1 })) : [];
}
