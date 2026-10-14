import { ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { Foco } from "@/components/foco";
import { Revelar } from "@/components/revelar";
import { getUltimaActualizacion } from "@/lib/datos";
import { getPeliculasListado, type PeliculaListado } from "@/lib/filas";
import { LISTADOS, type Listado } from "@/lib/listados";
import { rutaMapa } from "@/lib/mapa/layout";
import { openGraphDe } from "@/lib/og";
import { URL_SITIO, jsonLd } from "@/lib/sitio";

import { BotonMapa } from "./boton-mapa";
import { ListaPeliculas } from "./lista-peliculas";

export function metadatosListado(listado: Listado): Metadata {
  const n = getPeliculasListado(listado).length;
  // El año de la última actualización de los datos: el título se "renueva" solo al actualizarlos
  const anio = new Date(getUltimaActualizacion().fecha).getUTCFullYear();
  const titulo = listado.titulo(n, anio);
  const descripcion = listado.descripcion(n);
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: listado.ruta },
    openGraph: openGraphDe({ ruta: listado.ruta, imagen: listado.ruta.split("/").at(-1)!, titulo, descripcion }),
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}

// Página completa de un listado (los tres comparten estructura; cambia el texto y el orden)
export function PaginaListado({ listado }: { listado: Listado }) {
  const peliculas = getPeliculasListado(listado);
  const otros = LISTADOS.filter((l) => l.ruta !== listado.ruta);
  const faq = preguntas(listado, peliculas);
  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${URL_SITIO}/` },
          { "@type": "ListItem", position: 2, name: "Películas", item: `${URL_SITIO}/peliculas/` },
          { "@type": "ListItem", position: 3, name: listado.h1, item: `${URL_SITIO}${listado.ruta}/` },
        ],
      },
      {
        "@type": "ItemList",
        name: listado.h1,
        numberOfItems: peliculas.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: peliculas.map(({ pelicula: p }, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "Movie",
            name: p.titulo,
            ...(p.tituloOriginal !== p.titulo && { alternateName: p.tituloOriginal }),
            ...(p.fechaEstreno && { datePublished: p.fechaEstreno }),
            ...(p.poster && { image: p.poster }),
            ...(p.directores.length && { director: p.directores.map((name) => ({ "@type": "Person", name })) }),
            ...(p.duracionMin && { duration: `PT${p.duracionMin}M` }),
            ...((p.enlaces.wikipediaEs ?? p.enlaces.wikipediaEn) && { sameAs: p.enlaces.wikipediaEs ?? p.enlaces.wikipediaEn }),
          },
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faq.map((f) => ({
          "@type": "Question",
          name: f.pregunta,
          acceptedAnswer: { "@type": "Answer", text: textoRespuesta(f.respuesta) },
        })),
      },
    ],
  };

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-10 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(datos) }} />

      <nav aria-label="Ruta" className="font-mono text-xs text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="enlace-linea hover:text-foreground">
              Inicio
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li>
            <Link href="/peliculas" className="enlace-linea hover:text-foreground">
              Películas
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li aria-current="page" className="text-foreground">
            {listado.menu}
          </li>
        </ol>
      </nav>

      <p className="mt-8 font-mono text-xs tracking-widest text-muted-foreground uppercase">{peliculas.length} películas</p>
      <h1 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
        <span className="texto-degradado">{listado.h1}</span>
      </h1>
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="max-w-2xl leading-relaxed text-pretty text-muted-foreground">{textoIntro(listado, peliculas)}</p>
        <BotonMapa href={rutaMapa({ ambito: listado.soloMcu ? "mcu" : "todo", orden: listado.modo })} />
      </div>

      <ListaPeliculas peliculas={peliculas.map((p) => p.fila)} modo={listado.modo} />

      <section className="mt-16 grid gap-10">
        {faq.map(({ pregunta, respuesta }, i) => (
          <Revelar key={pregunta} retraso={i * 80}>
            <h2 className="font-display text-xl font-semibold">{pregunta}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-muted-foreground">
              {respuesta.map((parte, j) =>
                typeof parte === "string" ? (
                  parte
                ) : (
                  <Link
                    key={j}
                    href={parte.ruta}
                    className="text-neon underline decoration-neon/40 underline-offset-4 transition-[text-decoration-color] hover:decoration-neon"
                  >
                    {parte.enlace}
                  </Link>
                ),
              )}
            </p>
          </Revelar>
        ))}
      </section>

      <section className="mt-16">
        <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Otras formas de verlas</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ...otros.map((l) => ({ href: l.ruta, texto: l.h1 })),
            { href: "/mapa", texto: "Mapa de conexiones entre películas" },
            { href: "/personajes", texto: "Las películas de cada personaje" },
          ].map((e, i) => (
            <Revelar key={e.href} retraso={i * 90}>
              <Foco className="cristal-marcado h-full rounded-2xl transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1">
                <Link href={e.href} className="group flex h-full items-start justify-between gap-3 p-5 font-medium outline-none">
                  <span className="transition-colors duration-300 group-hover:text-neon">{e.texto}</span>
                  <ArrowRight className="mt-0.5 size-4 shrink-0 text-neon transition-transform duration-300 group-hover:translate-x-1.5" />
                </Link>
              </Foco>
            </Revelar>
          ))}
        </div>
      </section>
    </main>
  );
}

// ---------- textos (salen de los datos para no quedarse desactualizados) ----------

function textoIntro(listado: Listado, peliculas: PeliculaListado[]) {
  const primera = peliculas[0]?.pelicula;
  const ultima = peliculas.at(-1)?.pelicula;
  if (!primera || !ultima) return "";
  if (listado.modo === "cronologico") {
    const epoca = peliculas[0].fila.cronologia?.epoca;
    return `Este es el orden cronológico de las películas de Marvel, para seguir la historia del Universo Cinematográfico de Marvel (MCU) tal y como ocurre: empieza ${epoca ? `en ${epoca} ` : ""}con ${primera.titulo} y llega hasta ${ultima.titulo}. Cada película indica en qué año transcurre, según la línea temporal oficial de Marvel.`;
  }
  if (listado.soloMcu) {
    return `Las películas de Marvel en el orden en que llegaron a los cines, que es como se fueron descubriendo las sorpresas y las escenas poscréditos. Empieza con ${primera.titulo} (${primera.anio}) y llega hasta ${ultima.titulo} (${ultima.anio}).`;
  }
  return `Todas las películas de Marvel en orden, de ${primera.titulo} (${primera.anio}) a ${ultima.titulo} (${ultima.anio}): el MCU, los Spider-Man y Venom de Sony, los X-Men y Deadpool de Fox, películas de animación y telefilmes.`;
}

// Una respuesta es texto con enlaces a otros listados intercalados. Así se pinta en la página y, convertida
// a texto plano, va también al JSON-LD de FAQPage (lo que Google lee para las preguntas frecuentes).
type Respuesta = (string | Listado)[];
type Pregunta = { pregunta: string; respuesta: Respuesta };

function textoRespuesta(respuesta: Respuesta) {
  return respuesta.map((parte) => (typeof parte === "string" ? parte : parte.enlace)).join("");
}

// Lista legible: "A, B y C"
function enumerar(textos: string[]) {
  return textos.length < 2 ? (textos[0] ?? "") : `${textos.slice(0, -1).join(", ")} y ${textos.at(-1)}`;
}

function preguntas(listado: Listado, peliculas: PeliculaListado[]): Pregunta[] {
  const otro = (ruta: string) => LISTADOS.find((l) => l.ruta === ruta)!;
  const filas = peliculas.map((p) => p.fila);
  // Por fecha de estreno (sin fecha exacta cuenta como final de su año)
  const fecha = (p: PeliculaListado) => p.pelicula.fechaEstreno ?? `${p.pelicula.anio}-12-31`;
  const porEstreno = [...peliculas].sort((x, y) => fecha(x).localeCompare(fecha(y))).map((p) => p.fila);
  const ultimaEstrenada = porEstreno.filter((p) => !p.proximamente).at(-1);
  const proxima = porEstreno.find((p) => p.proximamente);
  const proximas = porEstreno.filter((p) => p.proximamente).length;

  // "¿Cuál es la última película de Marvel?": se busca mucho y la respuesta cambia con cada estreno
  const ultima: Pregunta[] = ultimaEstrenada
    ? [
        {
          pregunta: listado.soloMcu ? "¿Cuál es la última película del MCU?" : "¿Cuál es la última película de Marvel?",
          respuesta: [
            `La última estrenada es ${ultimaEstrenada.titulo}, que llegó a los cines el ${ultimaEstrenada.estreno}.`,
            proxima ? ` La siguiente será ${proxima.titulo} (${proxima.estreno}).` : "",
          ],
        },
      ]
    : [];

  if (listado.modo === "cronologico") {
    const [a, b, c] = filas;
    const primeraEstrenada = porEstreno[0];
    return [
      {
        pregunta: "¿Cómo ver las películas de Marvel en orden cronológico?",
        respuesta: [
          `Siguiendo la línea temporal oficial del MCU: empieza por ${enumerar(filas.slice(0, 6).map((p) => p.titulo))}, y continúa con la lista de arriba hasta ${filas.at(-1)!.titulo}. Son ${filas.length} películas y cada una indica en qué año transcurre.`,
        ],
      },
      {
        pregunta: "¿Cuál es la primera película del MCU en orden cronológico?",
        respuesta: [
          `${a.titulo}, que transcurre en ${a.cronologia?.epoca}. Le siguen ${b.titulo} (${b.cronologia?.epoca}) y ${c.titulo} (${c.cronologia?.epoca}). La primera que se estrenó, ${primeraEstrenada.titulo} (${primeraEstrenada.anio}), es la número ${primeraEstrenada.cronologia?.posicion} de la historia.`,
        ],
      },
      {
        pregunta: "¿Es mejor ver Marvel en orden cronológico o de estreno?",
        respuesta: [
          "Para una primera vez suele recomendarse el orden de estreno: las sorpresas y las escenas poscréditos se pensaron para verse así. El orden cronológico es ideal para un segundo visionado, porque la historia se entiende de principio a fin. Si prefieres el otro orden, aquí tienes las ",
          otro("/peliculas/mcu-orden-de-estreno"),
          ".",
        ],
      },
      ...ultima,
    ];
  }

  if (listado.soloMcu) {
    const primera = filas[0];
    return [
      {
        pregunta: "¿Cuál fue la primera película del MCU?",
        respuesta: [`${primera.titulo}, estrenada el ${primera.estreno}. Con ella empezó el Universo Cinematográfico de Marvel.`],
      },
      {
        pregunta: "¿En qué orden se estrenaron las películas de Marvel?",
        respuesta: [
          `Las primeras fueron ${enumerar(filas.slice(0, 5).map((p) => `${p.titulo} (${p.anio})`))}. La lista de arriba sigue el orden de estreno completo, fecha a fecha.`,
        ],
      },
      {
        pregunta: "¿Cuántas películas tiene el MCU?",
        respuesta: [
          `${filas.length} películas`,
          proximas > 0 ? `, contando ${proximas === 1 ? "una que aún no se ha estrenado" : `${proximas} que aún no se han estrenado`}` : "",
          ". Si quieres verlas siguiendo la historia, consulta las ",
          otro("/peliculas/mcu-orden-cronologico"),
          ".",
        ],
      },
      ...ultima,
    ];
  }

  const mcu = peliculas.filter((p) => p.pelicula.mcu).length;
  const primera = filas[0];
  return [
    {
      pregunta: "¿Cuántas películas de Marvel hay?",
      respuesta: [
        `${peliculas.length} películas basadas en Marvel Comics: ${mcu} del Universo Cinematográfico de Marvel y ${peliculas.length - mcu} de otros estudios, de animación o hechas para televisión.`,
      ],
    },
    {
      pregunta: "¿Cuál es la película de Marvel más antigua?",
      respuesta: [`${primera.titulo}, de ${primera.anio}: es la primera de esta lista.`],
    },
    {
      pregunta: "¿Qué películas de Marvel no son del MCU?",
      respuesta: [
        "Las de Sony (el Spider-Man de Sam Raimi, The Amazing Spider-Man, Venom, Morbius o Kraven), las de 20th Century Fox (X-Men, Lobezno, Los 4 Fantásticos y las primeras Deadpool), Blade, Ghost Rider, Daredevil y los telefilmes de los años 70 y 80. Solo las del MCU: ",
        otro("/peliculas/mcu-orden-de-estreno"),
        ".",
      ],
    },
    ...ultima,
  ];
}
