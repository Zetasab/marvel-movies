import type { MetadataRoute } from "next";

import { getUltimaActualizacion } from "@/lib/datos";
import { PAGINAS_LEGALES } from "@/lib/legal";
import { LISTADOS } from "@/lib/listados";
import { getFichasPersonaje, rutaPersonaje } from "@/lib/personajes";
import { URL_SITIO } from "@/lib/sitio";

// Con `output: "export"` (GitHub Pages) se genera como archivo estático en el build
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Las páginas cambian cuando se actualizan los datos. Con barra final, como las canonical (trailingSlash: true)
  const lastModified = getUltimaActualizacion().fecha;
  return [
    { url: `${URL_SITIO}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${URL_SITIO}/peliculas/`, lastModified, changeFrequency: "weekly", priority: 0.9 },
    ...LISTADOS.map((l) => ({ url: `${URL_SITIO}${l.ruta}/`, lastModified, changeFrequency: "weekly" as const, priority: 0.9 })),
    { url: `${URL_SITIO}/mapa/`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    { url: `${URL_SITIO}/personajes/`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...[...getFichasPersonaje().values()].map((f) => ({
      url: `${URL_SITIO}${rutaPersonaje(f.personaje.id)}/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: f.personaje.principal ? 0.7 : 0.5,
    })),
    ...PAGINAS_LEGALES.map((p) => ({ url: `${URL_SITIO}${p.href}/`, changeFrequency: "yearly" as const, priority: 0.1 })),
  ];
}
