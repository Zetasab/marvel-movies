import type { Metadata } from "next";

import { MapaRelaciones } from "@/components/mapa/mapa-relaciones";
import { getOrdenCronologico, getPeliculas, getPersonajes, getUltimaActualizacion } from "@/lib/datos";
import { colorDe, type PeliculaMapa, type PersonajeMapa } from "@/lib/mapa/layout";
import { formatearFecha } from "@/lib/formato";
import { openGraphDe } from "@/lib/og";
import { URL_SITIO, jsonLd } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Mapa del multiverso Marvel: cómo se conectan las películas",
  description:
    "Mapa interactivo de las películas de Marvel unidas por sus personajes: sigue a Iron Man, Thor o Spider-Man de película en película, en orden de estreno o cronológico.",
  alternates: { canonical: "/mapa" },
  openGraph: openGraphDe({ ruta: "/mapa", imagen: "mapa", titulo: "Mapa del multiverso Marvel: cómo se conectan las películas" }),
};

export default function MapaPage() {
  const peliculas = getPeliculas();
  const personajes = getPersonajes();
  const actualizacion = getUltimaActualizacion();
  const cronologia = getOrdenCronologico();

  // Al cliente solo le mandamos lo que usa el mapa (peliculas.json completo pesa ~500 KB)
  const pelis: PeliculaMapa[] = peliculas.map((p) => ({
    id: p.id,
    titulo: p.titulo,
    tituloOriginal: p.tituloOriginal,
    anio: p.anio,
    fechaEstreno: p.fechaEstreno,
    proximamente: p.proximamente,
    mcu: p.mcu,
    poster: p.poster,
    directores: p.directores,
    duracionMin: p.duracionMin,
    resumen: p.resumen,
    enlaces: p.enlaces,
    cronologia: p.mcu && cronologia.has(p.id) ? { posicion: cronologia.get(p.id)!.posicion, epoca: cronologia.get(p.id)!.epoca } : null,
  }));
  const pjs: PersonajeMapa[] = personajes.map((c, i) => ({
    id: c.id,
    nombre: c.nombre,
    principal: c.principal,
    peliculas: c.peliculas,
    color: colorDe(c.id, i),
  }));

  const datos = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${URL_SITIO}/` },
      { "@type": "ListItem", position: 2, name: "Mapa del multiverso Marvel", item: `${URL_SITIO}/mapa/` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datos) }} />
      <MapaRelaciones peliculas={pelis} personajes={pjs} ultimaActualizacion={formatearFecha(actualizacion.fecha)} />
    </>
  );
}
