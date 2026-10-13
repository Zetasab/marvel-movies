import type { NextConfig } from "next";

// En GitHub Pages la web cuelga de /<repositorio> (salvo en un repo usuario.github.io o con dominio propio).
// El workflow de .github/workflows/deploy.yml pasa esa ruta en NEXT_PUBLIC_BASE_PATH; en local queda vacía.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

const nextConfig: NextConfig = {
  // Web 100 % estática: `next build` genera la carpeta out/ que se sube a GitHub Pages
  output: "export",
  basePath,
  // /peliculas -> /peliculas/index.html, que GitHub Pages sirve sin configuración extra
  trailingSlash: true,
  // GitHub Pages no tiene servidor para optimizar imágenes
  images: { unoptimized: true },
  experimental: {
    agentFeedback: true,
  },
  // Sin cacheComponents/partialPrefetching: no aportan nada en una web 100 % estática y
  // cacheComponents no permite `dynamic = "force-static"`, que exige output: "export" en robots.ts y sitemap.ts
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
