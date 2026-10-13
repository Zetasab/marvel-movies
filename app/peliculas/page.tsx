import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Foco } from "@/components/foco";
import { BotonMapa } from "@/components/peliculas/boton-mapa";
import { Revelar } from "@/components/revelar";
import { getPeliculasListado } from "@/lib/filas";
import { LISTADOS } from "@/lib/listados";
import { rutaMapa } from "@/lib/mapa/layout";
import { openGraphDe } from "@/lib/og";
import { URL_SITIO, jsonLd } from "@/lib/sitio";

export const metadata: Metadata = {
  title: "Cómo ver las películas de Marvel en orden: cronológico o de estreno",
  description:
    "¿En qué orden ver las películas de Marvel? El MCU en orden cronológico según la línea temporal oficial, por orden de estreno, o todas las de Marvel por fecha.",
  alternates: { canonical: "/peliculas" },
  openGraph: openGraphDe({ ruta: "/peliculas", imagen: "peliculas", titulo: "Cómo ver las películas de Marvel en orden: cronológico o de estreno" }),
};

export default function PeliculasPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-12 pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${URL_SITIO}/` },
              { "@type": "ListItem", position: 2, name: "Películas", item: `${URL_SITIO}/peliculas/` },
            ],
          }),
        }}
      />
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Películas</p>
      <h1 className="mt-3 font-display text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
        <span className="texto-degradado">¿En qué orden ver las películas de Marvel?</span>
      </h1>
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="max-w-2xl leading-relaxed text-pretty text-muted-foreground">
          Elige cómo quieres verlas: siguiendo la historia del MCU tal y como ocurre, en el orden en que llegaron a los cines, o
          todas las películas basadas en Marvel Comics, también las de Sony y Fox.
        </p>
        {/* Sin filtros: el mapa abre como lo dejaste la última vez */}
        <BotonMapa href={rutaMapa()} />
      </div>

      <ul className="mt-10 grid gap-4">
        {LISTADOS.map((l) => ({ l, n: getPeliculasListado(l).length })).map(({ l, n }, i) => (
          <li key={l.ruta}>
            <Revelar retraso={i * 90}>
            <Foco className="cristal-marcado rounded-2xl transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1">
              <Link href={l.ruta} className="group flex items-center justify-between gap-4 p-6 outline-none">
                <div>
                  <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
                    {n} películas
                  </p>
                  <h2 className="mt-2 font-display text-xl font-semibold transition-colors duration-300 group-hover:text-neon">{l.h1}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.descripcion(n)}</p>
                </div>
                <ArrowRight className="size-5 shrink-0 text-neon transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </Foco>
            </Revelar>
          </li>
        ))}
      </ul>
    </main>
  );
}
