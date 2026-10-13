import type { Metadata } from "next";
import { ImageResponse } from "next/og";

import { getUltimaActualizacion } from "@/lib/datos";
import { getPeliculasListado } from "@/lib/filas";
import { LISTADOS } from "@/lib/listados";

// Imágenes para compartir (Open Graph / Twitter): 1200×630, generadas en el build como PNG estático en /og/<nombre>.png
// (app/og/[imagen]/route.tsx). No se usa opengraph-image.tsx porque en la exportación estática sale sin extensión
// y GitHub Pages lo serviría como application/octet-stream, que las redes sociales no muestran.
// Mismo estilo que la web: fondo noche, anillo "reactor arc" y degradado neón → violeta → plasma.
export const TAMANO_OG = { width: 1200, height: 630 };

const NEON = "#38c6f4";
const VIOLETA = "#a066ff";
const PLASMA = "#ff4d7d";

export function imagenOg({ antetitulo, titulo, pie }: { antetitulo: string; titulo: string; pie: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "radial-gradient(circle at 15% 10%, #16324a 0%, transparent 45%), radial-gradient(circle at 90% 90%, #3a1a3f 0%, transparent 50%), #0b0d1a",
          color: "#eef1fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, border: `5px solid ${NEON}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 14, height: 14, borderRadius: 999, background: PLASMA }} />
          </div>
          <div style={{ fontSize: 26, letterSpacing: 4, fontWeight: 700 }}>MARVEL MOVIES</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 26, letterSpacing: 3, color: "#9aa3c0", textTransform: "uppercase" }}>{antetitulo}</div>
          <div
            style={{
              fontSize: titulo.length > 42 ? 64 : 76,
              lineHeight: 1.05,
              fontWeight: 800,
              letterSpacing: -1,
              backgroundImage: `linear-gradient(90deg, ${NEON}, ${VIOLETA} 55%, ${PLASMA})`,
              backgroundClip: "text",
              color: "transparent",
              maxWidth: 1000,
            }}
          >
            {titulo}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#c5cbe0" }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: NEON }} />
          {pie}
        </div>
      </div>
    ),
    TAMANO_OG,
  );
}

type Contenido = { alt: string; antetitulo: string; titulo: string; pie: string };

// Una imagen por página importante; la clave es el nombre del archivo (sin .png)
export const IMAGENES_OG: Record<string, () => Contenido> = {
  inicio: () => {
    const { totalPeliculas, totalPersonajes } = getUltimaActualizacion();
    return {
      alt: "Marvel Movies: películas de Marvel en orden cronológico y de estreno",
      antetitulo: "En qué orden verlas y cómo se conectan",
      titulo: "Todas las películas de Marvel, en orden",
      pie: `${totalPeliculas} películas · ${totalPersonajes} personajes · mapa del multiverso`,
    };
  },
  peliculas: () => ({
    alt: "Cómo ver las películas de Marvel en orden",
    antetitulo: "Cronológico o de estreno",
    titulo: "¿En qué orden ver las películas de Marvel?",
    pie: "El MCU según la línea temporal oficial y todas las de Marvel por fecha",
  }),
  mapa: () => ({
    alt: "Mapa del multiverso Marvel",
    antetitulo: "Mapa interactivo",
    titulo: "Cómo se conectan las películas de Marvel",
    pie: "Sigue a cada personaje de película en película",
  }),
  // Una por listado, con el nombre de su ruta: mcu-orden-cronologico, mcu-orden-de-estreno…
  ...Object.fromEntries(
    LISTADOS.map((l) => [
      l.ruta.split("/").at(-1)!,
      () => ({ alt: l.h1, antetitulo: `${getPeliculasListado(l).length} películas`, titulo: l.h1, pie: "Con fichas, buscador y mapa del multiverso" }),
    ]),
  ),
};

// Para el `openGraph.images` de los metadatos de cada página (Twitter usa la misma si no tiene propia)
export function metadatosImagenOg(nombre: keyof typeof IMAGENES_OG): NonNullable<Metadata["openGraph"]>["images"] {
  return [{ url: `/og/${nombre}.png`, ...TAMANO_OG, alt: IMAGENES_OG[nombre]().alt, type: "image/png" }];
}
