import { ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Foco } from "@/components/foco";
import { Revelar } from "@/components/revelar";
import { getUltimaActualizacion } from "@/lib/datos";
import { openGraphDe } from "@/lib/og";
import { getFichasPersonaje, rutaPersonaje } from "@/lib/personajes";
import { URL_SITIO, jsonLd } from "@/lib/sitio";

const TITULO = "Personajes de Marvel: en qué películas sale cada uno";
const DESCRIPCION =
  "Iron Man, Capitán América, Thor, Spider-Man, Lobezno, Deadpool… Todas las películas en las que aparece cada personaje de Marvel, en orden y con quién lo interpreta.";

export const metadata: Metadata = {
  title: TITULO,
  description: DESCRIPCION,
  alternates: { canonical: "/personajes" },
  openGraph: openGraphDe({ ruta: "/personajes", imagen: "personajes", titulo: TITULO, descripcion: DESCRIPCION }),
  twitter: { card: "summary_large_image", title: TITULO, description: DESCRIPCION },
};

export default function PersonajesPage() {
  const fichas = [...getFichasPersonaje().values()];
  // personajes.json ya viene con los principales primero y por número de películas
  const principales = fichas.filter((f) => f.personaje.principal);
  const otros = fichas.filter((f) => !f.personaje.principal).sort((a, b) => a.titulo.localeCompare(b.titulo, "es"));
  const { totalPersonajes } = getUltimaActualizacion();

  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${URL_SITIO}/` },
          { "@type": "ListItem", position: 2, name: "Personajes", item: `${URL_SITIO}/personajes/` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Personajes principales de Marvel",
        numberOfItems: principales.length,
        itemListElement: principales.map((f, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: f.titulo,
          url: `${URL_SITIO}${rutaPersonaje(f.personaje.id)}/`,
        })),
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-10 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datos) }} />

      <nav aria-label="Ruta" className="font-mono text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="enlace-linea hover:text-foreground">
              Inicio
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li aria-current="page" className="text-foreground">
            Personajes
          </li>
        </ol>
      </nav>

      <p className="mt-8 font-mono text-xs tracking-widest text-muted-foreground uppercase">{totalPersonajes} personajes</p>
      <h1 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
        <span className="texto-degradado">Personajes de Marvel y sus películas</span>
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-pretty text-muted-foreground">
        Elige un personaje para ver todas las películas en las que aparece, en orden de estreno, quién lo interpreta y con qué
        otros héroes y villanos coincide. Incluye el MCU, las películas de Sony y Fox, la animación y los telefilmes.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">Personajes principales</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {principales.map((f, i) => (
            <li key={f.personaje.id} className="min-w-0">
              <Revelar retraso={(i % 6) * 50}>
                <Foco className="cristal-marcado h-full rounded-2xl transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1">
                  <Link href={rutaPersonaje(f.personaje.id)} className="group flex h-full items-center gap-3 p-4 outline-none">
                    <span className="size-3 shrink-0 rounded-full" style={{ background: f.color, boxShadow: `0 0 calc(var(--glow) * 10px) ${f.color}` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium transition-colors duration-300 group-hover:text-neon">{f.titulo}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {f.peliculas.length} películas
                        {f.interpretes.length > 0 && ` · ${f.interpretes.slice(0, 2).join(", ")}`}
                      </span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-neon transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Foco>
              </Revelar>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold">Más personajes</h2>
        <ul className="mt-5 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {otros.map((f) => (
            <li key={f.personaje.id} className="flex items-baseline gap-2">
              <span className="size-2 shrink-0 translate-y-[-1px] rounded-full" style={{ background: f.color }} />
              <Link href={rutaPersonaje(f.personaje.id)} className="enlace-linea truncate hover:text-neon">
                {f.titulo}
              </Link>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{f.peliculas.length}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
