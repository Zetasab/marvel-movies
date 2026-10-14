import { ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Foco } from "@/components/foco";
import { BotonMapa } from "@/components/peliculas/boton-mapa";
import { ListaPeliculas } from "@/components/peliculas/lista-peliculas";
import { Revelar } from "@/components/revelar";
import { getOrdenCronologico, type Pelicula } from "@/lib/datos";
import { filaDe } from "@/lib/filas";
import { formatearEstreno } from "@/lib/formato";
import { rutaMapa } from "@/lib/mapa/layout";
import { IMAGENES_OG, imagenOgPersonaje, openGraphDe } from "@/lib/og";
import { getFichaPersonaje, getFichasPersonaje, rutaPersonaje, type FichaPersonaje } from "@/lib/personajes";
import { URL_SITIO, jsonLd } from "@/lib/sitio";

// Web estática: una página por personaje, generada en el build; cualquier otra ruta da 404
export const dynamicParams = false;

export function generateStaticParams() {
  return [...getFichasPersonaje().keys()].map((id) => ({ id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const f = getFichaPersonaje((await params).id);
  if (!f) return {};
  const { titulo, descripcion } = textosSeo(f);
  const ruta = rutaPersonaje(f.personaje.id);
  const imagen = imagenOgPersonaje(f.personaje.id);
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: openGraphDe({ ruta, imagen: imagen in IMAGENES_OG ? imagen : "personajes", titulo, descripcion }),
    twitter: { card: "summary_large_image", title: titulo, description: descripcion },
  };
}

export default async function PersonajePage({ params }: Props) {
  const f = getFichaPersonaje((await params).id);
  if (!f) notFound();
  const { personaje: c, peliculas, interpretes, companeros } = f;
  const cronologia = getOrdenCronologico();
  const ruta = rutaPersonaje(c.id);
  const estrenadas = peliculas.filter((p) => !p.proximamente);
  const proximas = peliculas.filter((p) => p.proximamente);
  const mcu = peliculas.filter((p) => p.mcu).length;
  const primera = estrenadas[0] ?? peliculas[0];
  const ultima = estrenadas.at(-1);
  const faq = preguntas(f, cronologia);

  const datos = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: `${URL_SITIO}/` },
          { "@type": "ListItem", position: 2, name: "Personajes", item: `${URL_SITIO}/personajes/` },
          { "@type": "ListItem", position: 3, name: f.titulo, item: `${URL_SITIO}${ruta}/` },
        ],
      },
      {
        "@type": "ItemList",
        name: `Películas de ${f.titulo}`,
        numberOfItems: peliculas.length,
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        itemListElement: peliculas.map((p, i) => ({
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
        mainEntity: faq.map((q) => ({
          "@type": "Question",
          name: q.pregunta,
          acceptedAnswer: { "@type": "Answer", text: q.respuesta },
        })),
      },
    ],
  };

  const cifras = [
    ["Películas", String(peliculas.length)],
    ["Del MCU", String(mcu)],
    ["Primera", primera && String(primera.anio)],
    [proximas.length ? "Próxima" : "Última", proximas.length ? String(proximas[0].anio) : ultima && String(ultima.anio)],
  ].filter((x): x is [string, string] => Boolean(x[1]));

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
            <Link href="/personajes" className="enlace-linea hover:text-foreground">
              Personajes
            </Link>
          </li>
          <ChevronRight className="size-3" aria-hidden />
          <li aria-current="page" className="text-foreground">
            {f.titulo}
          </li>
        </ol>
      </nav>

      <p className="mt-8 flex items-center gap-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">
        <span className="size-2.5 rounded-full" style={{ background: f.color, boxShadow: `0 0 calc(var(--glow) * 10px) ${f.color}` }} />
        Personaje{c.principal && " principal"}
      </p>
      <h1 className="mt-3 font-display text-3xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
        <span className="texto-degradado">Películas de {f.titulo} en orden</span>
      </h1>
      <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-center md:justify-between md:gap-8">
        <p className="max-w-2xl leading-relaxed text-pretty text-muted-foreground">{textoIntro(f)}</p>
        <BotonMapa href={rutaMapa({ ambito: mcu === peliculas.length ? "mcu" : "todo", personaje: c.id })} />
      </div>

      {/* Línea del color del personaje, como sus cables en el mapa */}
      <div className="mt-8 h-1 rounded-full" style={{ background: f.color, opacity: 0.85 }} />

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cifras.map(([t, v]) => (
          <div key={t} className="cristal-marcado rounded-2xl px-4 py-3">
            <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{t}</dt>
            <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">{v}</dd>
          </div>
        ))}
      </dl>

      {interpretes.length > 0 && (
        <section className="mt-8">
          <h2 className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Interpretado por</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {interpretes.map((a) => (
              <li key={a} className="rounded-full border bg-card/50 px-3 py-1 text-sm">
                {a}
              </li>
            ))}
          </ul>
        </section>
      )}

      <ListaPeliculas peliculas={peliculas.map((p) => filaDe(p, cronologia))} modo="estreno" />

      {companeros.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-semibold">Personajes con los que más coincide</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {companeros.map(({ personaje: o, juntos }, i) => {
              const { color, titulo } = getFichaPersonaje(o.id)!;
              return (
                <li key={o.id} className="min-w-0">
                  <Revelar retraso={(i % 4) * 60}>
                    <Foco className="cristal-marcado h-full rounded-2xl transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-1">
                      <Link href={rutaPersonaje(o.id)} className="group flex items-center gap-3 p-4 outline-none">
                        <span className="size-3 shrink-0 rounded-full" style={{ background: color }} />
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium transition-colors duration-300 group-hover:text-neon">{titulo}</span>
                          <span className="block text-xs text-muted-foreground">{juntos} películas juntos</span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-neon transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Foco>
                  </Revelar>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mt-16 grid gap-10">
        {faq.map(({ pregunta, respuesta }, i) => (
          <Revelar key={pregunta} retraso={i * 80}>
            <h2 className="font-display text-xl font-semibold">{pregunta}</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-pretty text-muted-foreground">{respuesta}</p>
          </Revelar>
        ))}
      </section>

      <p className="mt-16 text-sm text-muted-foreground">
        ¿Buscas a otro?{" "}
        <Link href="/personajes" className="text-neon underline decoration-neon/40 underline-offset-4 transition-[text-decoration-color] hover:decoration-neon">
          Ver todos los personajes de Marvel
        </Link>
      </p>
    </main>
  );
}

// ---------- textos (salen de los datos para no quedarse desactualizados) ----------

// Lista legible: "A, B y C"
function enumerar(textos: string[]) {
  return textos.length < 2 ? (textos[0] ?? "") : `${textos.slice(0, -1).join(", ")} y ${textos.at(-1)}`;
}

function plural(n: number, uno: string, varios: string) {
  return `${n} ${n === 1 ? uno : varios}`;
}

// <title> y meta description. El título empieza por lo que se busca ("películas de thor en orden")
function textosSeo({ personaje: c, titulo: nombre, peliculas, interpretes }: FichaPersonaje) {
  const n = peliculas.length;
  const titulo = `Películas de ${nombre} en orden: ${n === 1 ? "en la que aparece" : `las ${n} en las que aparece`}`;
  const estrenadas = peliculas.filter((p) => !p.proximamente);
  const primera = estrenadas[0] ?? peliculas[0];
  const ultima = estrenadas.at(-1) ?? peliculas.at(-1)!;
  let descripcion = `Todas las películas de ${c.nombre} por orden de estreno, de ${primera.titulo} (${primera.anio})`;
  descripcion += ultima.id !== primera.id ? ` a ${ultima.titulo} (${ultima.anio}).` : ".";
  if (interpretes.length) descripcion += ` Con ${enumerar(interpretes.slice(0, 2))}.`;
  // ~160 caracteres: si se pasa, se corta en la última frase completa
  if (descripcion.length > 160) descripcion = descripcion.slice(0, descripcion.lastIndexOf(".", 160) + 1) || descripcion;
  return { titulo, descripcion };
}

function textoIntro({ personaje: c, peliculas, interpretes }: FichaPersonaje) {
  const estrenadas = peliculas.filter((p) => !p.proximamente);
  const proxima = peliculas.find((p) => p.proximamente);
  const mcu = peliculas.filter((p) => p.mcu).length;
  const primera = estrenadas[0];
  const ultima = estrenadas.at(-1);
  const partes = [
    `${c.nombre} aparece en ${plural(peliculas.length, "película", "películas")} de Marvel${
      mcu && mcu < peliculas.length ? `, ${mcu} de ellas del Universo Cinematográfico de Marvel (MCU)` : mcu ? ", todas del MCU" : ""
    }.`,
  ];
  if (primera && ultima && primera.id !== ultima.id)
    partes.push(`Su primera aparición fue en ${primera.titulo} (${primera.anio}) y la más reciente, ${ultima.titulo} (${ultima.anio}).`);
  else if (primera) partes.push(`Apareció en ${primera.titulo} (${primera.anio}).`);
  if (proxima) partes.push(`Volverá en ${proxima.titulo}.`);
  // "le ha(n) dado vida": no sabemos el género del personaje
  if (interpretes.length)
    partes.push(`${interpretes.length === 1 ? "Le ha dado vida" : "Le han dado vida"} ${enumerar(interpretes.slice(0, 4))}.`);
  return partes.join(" ");
}

type Pregunta = { pregunta: string; respuesta: string };

function preguntas(f: FichaPersonaje, cronologia: ReturnType<typeof getOrdenCronologico>): Pregunta[] {
  const { personaje: c, peliculas, interpretes } = f;
  const estrenadas = peliculas.filter((p) => !p.proximamente);
  const proximas = peliculas.filter((p) => p.proximamente);
  const estreno = (p: Pelicula) => formatearEstreno(p.fechaEstreno, p.anio);
  const lista: Pregunta[] = [
    {
      pregunta: `¿En cuántas películas sale ${c.nombre}?`,
      respuesta: `En ${plural(peliculas.length, "película", "películas")}${
        proximas.length ? `, contando ${proximas.length === 1 ? "una que aún no se ha estrenado" : `${proximas.length} que aún no se han estrenado`}` : ""
      }: ${enumerar(peliculas.map((p) => `${p.titulo} (${p.anio})`))}.`,
    },
  ];
  if (estrenadas[0])
    lista.push({
      pregunta: `¿Cuál es la primera película de ${c.nombre}?`,
      respuesta: `${estrenadas[0].titulo}, estrenada el ${estreno(estrenadas[0])}.`,
    });
  if (interpretes.length)
    lista.push({
      pregunta: `¿Quién interpreta a ${c.nombre}?`,
      respuesta:
        interpretes.length === 1
          ? `${interpretes[0]}.`
          : `${interpretes[0]} es quien más veces le ha dado vida. También ${interpretes.length === 2 ? "lo ha hecho" : "lo han hecho"} ${enumerar(interpretes.slice(1, 6))}.`,
    });
  // Orden de la historia: solo tiene sentido si sale en varias películas de la línea temporal del MCU
  const enCronologia = peliculas
    .filter((p) => cronologia.has(p.id))
    .sort((a, b) => cronologia.get(a.id)!.posicion - cronologia.get(b.id)!.posicion);
  if (enCronologia.length >= 2)
    lista.push({
      pregunta: `¿En qué orden ver las películas de ${c.nombre} del MCU?`,
      respuesta: `Siguiendo la historia del MCU, el orden es: ${enumerar(enCronologia.map((p) => p.titulo))}.`,
    });
  return lista;
}
