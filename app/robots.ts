import type { MetadataRoute } from "next";

import { URL_SITIO } from "@/lib/sitio";

// Con `output: "export"` (GitHub Pages) se genera como archivo estático en el build
export const dynamic = "force-static";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

export default function robots(): MetadataRoute.Robots {
  return {
    // /datos/ son JSON que los listados cargan al pulsar (las series): no son páginas
    rules: { userAgent: "*", allow: "/", disallow: `${BASE_PATH}/datos/` },
    sitemap: `${URL_SITIO}/sitemap.xml`,
  };
}
