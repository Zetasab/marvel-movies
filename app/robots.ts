import type { MetadataRoute } from "next";

import { URL_SITIO } from "@/lib/sitio";

// Con `output: "export"` (GitHub Pages) se genera como archivo estático en el build
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
