import { readFileSync } from "node:fs";
import { join } from "node:path";

import type { Metadata } from "next";
import { ImageResponse } from "next/og";
import sharp from "sharp";

import { getUltimaActualizacion } from "@/lib/datos";
import { getPeliculasListado } from "@/lib/filas";
import { LISTADOS } from "@/lib/listados";
import { NOMBRE_SITIO } from "@/lib/sitio";

// Imágenes al compartir un enlace (WhatsApp, Telegram, X, Facebook, LinkedIn, Discord…): 1200×630, generadas en el
// build como JPG estático en /og/<nombre>.jpg (app/og/[imagen]/route.tsx).
// - No se usa opengraph-image.tsx porque en la exportación estática sale sin extensión y GitHub Pages lo serviría
//   como application/octet-stream, que las redes no muestran.
// - JPG y no PNG: con la foto de fondo el PNG pesaría cerca de 1 MB, y WhatsApp descarta las imágenes pesadas
//   (por encima de ~300 KB no siempre muestra la vista previa).
// Diseño: la foto de la sección oscurecida, y encima el logo, el título con el degradado de la web y un pie.
export const TAMANO_OG = { width: 1200, height: 630 };

const NEON = "#4ae9f9";
const VIOLETA = "#b48cff";
const PLASMA = "#ff5c82";

// Fotos de fondo (assets/og/*.jpg, ya recortadas a 1200×630 desde ../imagenes-originales)
type Foto = "inicio" | "peliculas" | "mapa";

function fotoComoDataUrl(foto: Foto) {
  const datos = readFileSync(join(process.cwd(), "assets", "og", `${foto}.jpg`));
  return `data:image/jpeg;base64,${datos.toString("base64")}`;
}

type Contenido = { alt: string; antetitulo: string; titulo: string; pie: string; foto: Foto };

export async function imagenOg({ antetitulo, titulo, pie, foto }: Contenido) {
  const png = new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", color: "#eef1fb", fontFamily: "sans-serif" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- dentro de ImageResponse solo vale <img> */}
        <img src={fotoComoDataUrl(foto)} alt="" width={1200} height={630} style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover" }} />
        {/* Velo: muy oscuro a la izquierda (donde va el texto) y la foto se deja ver a la derecha */}
        <div
          style={{
            // Satori (el motor de ImageResponse) no entiende `inset`: posición y tamaño explícitos
            position: "absolute",
            top: 0,
            left: 0,
            width: 1200,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, rgba(9,11,22,0.96) 0%, rgba(9,11,22,0.88) 45%, rgba(9,11,22,0.35) 100%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", padding: "60px 72px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 46, height: 46, borderRadius: 999, border: `5px solid ${NEON}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 0 24px ${NEON}` }}>
              <div style={{ width: 15, height: 15, borderRadius: 999, background: PLASMA }} />
            </div>
            <div style={{ fontSize: 28, letterSpacing: 5, fontWeight: 700 }}>MARVEL MOVIES</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 820 }}>
            <div style={{ fontSize: 26, letterSpacing: 3, color: "#aab3d0", textTransform: "uppercase" }}>{antetitulo}</div>
            <div
              style={{
                fontSize: titulo.length > 40 ? 66 : 78,
                lineHeight: 1.04,
                fontWeight: 800,
                letterSpacing: -1,
                backgroundImage: `linear-gradient(90deg, ${NEON}, ${VIOLETA} 55%, ${PLASMA})`,
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {titulo}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 26, color: "#d3d8ea" }}>
            <div style={{ width: 10, height: 10, borderRadius: 999, background: NEON }} />
            {pie}
          </div>
        </div>
      </div>
    ),
    TAMANO_OG,
  );
  const jpg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 78, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpg), { headers: { "Content-Type": "image/jpeg" } });
}

// Una imagen por página importante; la clave es el nombre del archivo (sin .jpg)
export const IMAGENES_OG: Record<string, () => Contenido> = {
  inicio: () => {
    const { totalPeliculas, totalPersonajes } = getUltimaActualizacion();
    return {
      alt: "Marvel Movies: películas de Marvel en orden cronológico y de estreno",
      antetitulo: "En qué orden verlas y cómo se conectan",
      titulo: "Todas las películas de Marvel, en orden",
      pie: `${totalPeliculas} películas · ${totalPersonajes} personajes · mapa del multiverso`,
      foto: "inicio",
    };
  },
  peliculas: () => ({
    alt: "Cómo ver las películas de Marvel en orden",
    antetitulo: "Cronológico o de estreno",
    titulo: "¿En qué orden ver las películas de Marvel?",
    pie: "El MCU según la línea temporal oficial y todas las de Marvel",
    foto: "peliculas",
  }),
  mapa: () => ({
    alt: "Mapa del multiverso Marvel",
    antetitulo: "Mapa interactivo",
    titulo: "Cómo se conectan las películas de Marvel",
    pie: "Sigue a cada personaje de película en película",
    foto: "mapa",
  }),
  // Una por listado, con el nombre de su ruta: mcu-orden-cronologico, mcu-orden-de-estreno…
  ...Object.fromEntries(
    LISTADOS.map((l) => [
      l.ruta.split("/").at(-1)!,
      (): Contenido => ({
        alt: l.h1,
        antetitulo: `${getPeliculasListado(l).length} películas`,
        titulo: l.h1,
        pie: "Con fichas, buscador y mapa del multiverso",
        foto: "peliculas",
      }),
    ]),
  ),
};

// Para el `openGraph.images` de los metadatos de cada página (X/Twitter usa la misma si no tiene propia)
export function metadatosImagenOg(nombre: keyof typeof IMAGENES_OG): NonNullable<Metadata["openGraph"]>["images"] {
  return [{ url: `/og/${nombre}.jpg`, ...TAMANO_OG, alt: IMAGENES_OG[nombre]().alt, type: "image/jpeg" }];
}

// Bloque openGraph completo de una página. Next no lo hereda por partes: si una página define su openGraph,
// sustituye entero al del layout, así que todas pasan por aquí para no perder siteName, locale o la imagen.
export function openGraphDe({
  ruta,
  imagen,
  titulo,
  descripcion,
}: {
  ruta: string;
  imagen: keyof typeof IMAGENES_OG;
  titulo?: string;
  descripcion?: string;
}): Metadata["openGraph"] {
  return {
    type: "website",
    siteName: NOMBRE_SITIO,
    locale: "es_ES",
    url: ruta,
    ...(titulo && { title: titulo }),
    ...(descripcion && { description: descripcion }),
    images: metadatosImagenOg(imagen),
  };
}
