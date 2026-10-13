import type { MetadataRoute } from "next";

import { NOMBRE_SITIO } from "@/lib/sitio";

// En GitHub Pages la web cuelga de /<repo>: las rutas del manifest no la añaden solas
const base = process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? "";

// Con `output: "export"` (GitHub Pages) se genera como archivo estático en el build
export const dynamic = "force-static";

// Nombre, colores e iconos al añadir la web a la pantalla de inicio (Android, escritorio)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${NOMBRE_SITIO}: películas de Marvel en orden`,
    short_name: NOMBRE_SITIO,
    description: "Todas las películas de Marvel en orden cronológico y de estreno, y un mapa de cómo se conectan.",
    lang: "es",
    start_url: `${base}/`,
    scope: `${base}/`,
    display: "standalone",
    background_color: "#0d101a",
    theme_color: "#0d101a",
    icons: [
      { src: `${base}/icono-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${base}/icono-512.png`, sizes: "512x512", type: "image/png" },
    ],
  };
}
