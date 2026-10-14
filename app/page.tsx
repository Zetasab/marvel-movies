import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { CablesHero, type PosterHero } from "@/components/inicio/cables-hero";
import { Contador } from "@/components/contador";
import { Foco } from "@/components/foco";
import { Revelar } from "@/components/revelar";
import { buttonVariants } from "@/components/ui/button";
import {
  getOrdenCronologico,
  getPeliculas,
  getPersonajes,
  getUltimaActualizacion,
} from "@/lib/datos";
import { miniatura } from "@/lib/imagenes";
import { openGraphDe } from "@/lib/og";
import { colorDe } from "@/lib/mapa/layout";
import { GITHUB_PERFIL, GITHUB_REPO, NOMBRE_SITIO, URL_SITIO, jsonLd } from "@/lib/sitio";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  openGraph: openGraphDe({ ruta: "/", imagen: "inicio", titulo: "Todas las películas de Marvel, en orden" }),
  // Como el openGraph, el bloque twitter de una página sustituye entero al del layout: hay que repetir la tarjeta grande
  twitter: { card: "summary_large_image", title: "Todas las películas de Marvel, en orden" },
};

// Las cuatro películas en solitario de la Fase Uno que desembocan en The Avengers (por código de Wikidata)
const HERO = {
  origenes: [
    { wikidata: "Q192724", personaje: "iron-man" },
    { wikidata: "Q217020", personaje: "thor" },
    { wikidata: "Q275120", personaje: "capitan-america" },
    { wikidata: "Q466611", personaje: "hulk" },
  ],
  destino: "Q182218",
};

export default function Home() {
  const peliculas = getPeliculas();
  const actualizacion = getUltimaActualizacion();
  const porWikidata = new Map(peliculas.map((p) => [p.ids.wikidata, p]));
  const aPoster = (wikidata: string, color = "var(--neon)"): PosterHero => {
    const p = porWikidata.get(wikidata);
    return {
      titulo: p?.titulo ?? "",
      poster: miniatura(p?.poster ?? null),
      color,
    };
  };

  const enMcu = peliculas.filter((p) => p.mcu).length;
  const enCronologia = getOrdenCronologico().size;
  const principales = getPersonajes().filter((c) => c.principal).length;

  // Quién es la web para Google: nombre del sitio en los resultados y autor
  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${URL_SITIO}/#web`,
        name: NOMBRE_SITIO,
        alternateName: "Películas de Marvel en orden",
        url: `${URL_SITIO}/`,
        inLanguage: "es",
        description: "Todas las películas de Marvel en orden cronológico y de estreno, y un mapa de cómo se conectan.",
        author: { "@id": `${URL_SITIO}/#autor` },
      },
      { "@type": "Person", "@id": `${URL_SITIO}/#autor`, name: "Zetasab", url: GITHUB_PERFIL, sameAs: [GITHUB_PERFIL, GITHUB_REPO] },
    ],
  };

  return (
    <main className="flex-1">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datos) }} />
      <section className="relative">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
          <div>
            <p className="entrada font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {actualizacion.totalPeliculas} películas ·{" "}
              {actualizacion.totalPersonajes} personajes
            </p>
            <h1
              style={{ ["--retraso" as string]: "80ms" }}
              className="entrada mt-5 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
            >
              Cada película Marvel,{" "}
              <span className="texto-degradado">conectada</span>.
            </h1>
            <p
              style={{ ["--retraso" as string]: "180ms" }}
              className="entrada mt-6 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground"
            >
              De los telefilmes de los setenta a los estrenos de este año.
              Decide qué ver, en qué orden y descubre qué personajes unen unas
              películas con otras.
            </p>
            <p
              style={{ ["--retraso" as string]: "260ms" }}
              className="entrada mt-3 max-w-md text-xs leading-relaxed text-muted-foreground/80"
            >
              Proyecto personal de un programador, sin ánimo de lucro: sin
              publicidad, sin pagos y sin recogida de datos. Web no oficial, sin
              relación con Marvel ni Disney.
            </p>
            <div
              style={{ ["--retraso" as string]: "340ms" }}
              className="entrada mt-8 flex flex-wrap gap-3"
            >
              <Link
                href="/peliculas"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "boton-glow group h-10 rounded-full px-5",
                )}
              >
                Ver las películas{" "}
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/mapa"
                className={cn(
                  buttonVariants({ size: "lg", variant: "ghost" }),
                  "cristal h-10 rounded-full px-5 hover:text-neon hover:shadow-[0_0_24px_-8px_var(--neon)]",
                )}
              >
                Abrir el mapa
              </Link>
            </div>
          </div>

          <div className="relative">
            {/* Halo detrás de The Avengers */}
            <div
              aria-hidden
              className="absolute top-1/2 right-[2%] -z-10 size-[60%] -translate-y-1/2"
              style={{ opacity: "calc(var(--glow) * 0.45)" }}
            >
              <div className="degradado-marca respirar size-full rounded-full blur-[90px]" />
            </div>
            <CablesHero
              origenes={HERO.origenes.map((o, i) =>
                aPoster(o.wikidata, colorDe(o.personaje, i)),
              )}
              destino={aPoster(HERO.destino)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
        <Acceso
          href="/peliculas"
          etiqueta={
            <>
              <Contador valor={peliculas.length} /> películas ·{" "}
              <Contador valor={enCronologia} /> con orden cronológico
            </>
          }
          titulo="Películas"
          texto="Todas, de Marvel Studios, Sony y Fox: el MCU en el orden en que transcurre o en el de estreno, con buscador por título, actor o director."
        />
        <Acceso
          href="/mapa"
          retraso={120}
          etiqueta={
            <>
              <Contador valor={enMcu} /> del MCU ·{" "}
              <Contador valor={principales} /> personajes principales
            </>
          }
          titulo="Mapa del multiverso"
          texto="Cada personaje es un cable que recorre sus películas. Sigue a Iron Man desde 2008 o mira qué historias desembocan en cada película de los Vengadores."
        />
        <Acceso
          href="/personajes"
          retraso={240}
          etiqueta={
            <>
              <Contador valor={actualizacion.totalPersonajes} /> personajes
            </>
          }
          titulo="Personajes"
          texto="En qué películas sale cada uno y en qué orden verlas: Thor, Spider-Man, Lobezno, Viuda Negra… con quién lo interpreta y con quién coincide."
        />
      </section>
    </main>
  );
}

function Acceso({
  href,
  etiqueta,
  titulo,
  texto,
  retraso = 0,
}: {
  href: string;
  etiqueta: React.ReactNode;
  titulo: string;
  texto: string;
  retraso?: number;
}) {
  return (
    <Revelar retraso={retraso}>
      <Foco className="cristal h-full rounded-3xl transition-[box-shadow,translate] duration-300 ease-out hover:-translate-y-1 has-focus-visible:ring-2 has-focus-visible:ring-neon">
        <Link href={href} className="group block p-7 outline-none">
          <p className="font-mono text-xs tracking-wider text-muted-foreground uppercase">
            {etiqueta}
          </p>
          <h2 className="mt-4 flex items-center gap-2 font-display text-2xl font-semibold transition-colors group-hover:text-neon">
            {titulo}
            <ArrowRight className="size-5 text-neon transition-transform duration-300 group-hover:translate-x-1.5" />
          </h2>
          <p className="mt-3 leading-relaxed text-muted-foreground">{texto}</p>
        </Link>
      </Foco>
    </Revelar>
  );
}
