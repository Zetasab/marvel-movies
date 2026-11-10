import { ArrowUpRight } from "lucide-react";

import { moverFoco } from "@/components/foco";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Una fila del listado: una película o, si se marca «Incluir series», una serie
export type PeliculaFila = {
  id: string;
  titulo: string;
  tituloOriginal: string;
  anio: number | null; // solo las series anunciadas sin fecha no tienen año
  estreno: string; // ya formateada, p. ej. "2 de mayo de 2008"
  orden: string; // para mezclar películas y series por fecha: "AAAA-MM-DD", "AAAA-MM" o "AAAA"
  proximamente: boolean;
  mcu: boolean;
  tipo: "imagen-real" | "animacion";
  formato: "cine" | "tv-dvd" | "serie";
  poster: string | null;
  directores: string[]; // en las series, quién la creó
  reparto: string[]; // primeros actores
  duracionMin: number | null;
  recaudacion: string | null; // ya formateada, p. ej. "585 M$"
  resumen: string | null;
  enlaces: { wikipedia: string | null; imdb: string | null };
  // Lugar en la línea temporal del MCU. Las películas tienen número (posicion); las series no: van detrás
  // de la película `despuesDe` (id de película; null = antes de la primera), por `indice` (su orden en el JSON)
  cronologia: { posicion: number | null; epoca: string | null; nota: string | null; despuesDe?: string | null; indice?: number } | null;
  serie: {
    emision: string; // ya formateada, p. ej. "2015–2018" o "2021–actualidad"
    enEmision: boolean;
    temporadas: number | null;
    episodios: number | null;
    cadenas: string[];
  } | null; // null en las películas
  // Lo que solo se ve en el panel lateral al pulsar la card
  detalle: {
    guionistas: string[];
    reparto: { actor: string; personaje: string | null }[];
    generos: string[];
    productoras: string[];
    presupuesto: string | null; // ya formateado, p. ej. "150 M$"
  };
};

export function FilaPelicula({
  pelicula: p,
  verCronologia = false,
  prioritaria = false,
  onAbrir,
}: {
  pelicula: PeliculaFila;
  verCronologia?: boolean;
  prioritaria?: boolean; // las primeras de la lista se ven al cargar: su póster no se retrasa (cuenta para el LCP)
  onAbrir: () => void;
}) {
  const meta = p.serie
    ? [p.serie.emision, temporadasEpisodios(p.serie), p.serie.cadenas.slice(0, 2).join(" / ")].filter(Boolean)
    : [p.estreno, p.duracionMin && `${p.duracionMin} min`, p.recaudacion && `Recaudó ${p.recaudacion}`].filter(Boolean);
  const cronologia = verCronologia ? p.cronologia : null;

  return (
    <Card
      onMouseMove={moverFoco}
      className="group/fila cristal-marcado foco-raton flex-row gap-3 rounded-2xl bg-transparent p-2.5 ring-0 outline-offset-2 has-[.abrir-panel:focus-visible]:outline-2 has-[.abrir-panel:focus-visible]:outline-neon transition-[box-shadow,translate] duration-300 ease-out hover:-translate-y-0.5 sm:gap-4 sm:p-3"
    >
      {/* Póster dentro de la card, con su margen y las cuatro esquinas redondeadas (radio concéntrico con la card).
          Mínimo proporción de póster (2:3); si la fila es más alta, la imagen se estira y recorta para llenarla */}
      <div className="relative isolate aspect-2/3 w-24 shrink-0 self-stretch overflow-hidden rounded-xl bg-muted shadow-lg ring-1 shadow-black/20 ring-foreground/10 transition-[box-shadow] duration-300 group-hover/fila:shadow-[0_10px_30px_-10px_var(--neon)] sm:w-36">
        {p.poster ? (
          // eslint-disable-next-line @next/next/no-img-element -- póster externo de Wikipedia, sin optimizar
          <img
            src={p.poster}
            alt={`Póster de ${p.titulo}`}
            loading={prioritaria ? "eager" : "lazy"}
            fetchPriority={prioritaria ? "high" : "auto"}
            decoding="async"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover/fila:scale-[1.04] motion-reduce:transition-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-2 text-center font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
            Sin póster
          </div>
        )}
        {/* Brillo sutil en el borde interior para que el póster no se funda con el fondo */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-white/10 ring-inset" aria-hidden />
        {cronologia?.posicion != null && (
          // Posición en la línea temporal del MCU
          <span className="absolute top-2 left-2 rounded-md bg-background/85 px-1.5 py-0.5 font-mono text-xs font-semibold text-neon tabular-nums backdrop-blur transition-[scale,box-shadow] duration-300 group-hover/fila:scale-110 group-hover/fila:shadow-[0_0_14px_-2px_var(--neon)]">
            #{String(cronologia.posicion).padStart(2, "0")}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3 py-1.5 pr-1.5 sm:py-2 sm:pr-2">
        <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
          <div className="min-w-0">
            <h3 className="font-display text-base leading-snug font-semibold transition-colors duration-300 group-hover/fila:text-neon sm:text-lg">
              {/* Su ::after cubre toda la card, así que pulsar en cualquier sitio abre el panel (los enlaces quedan por encima) */}
              <button
                type="button"
                onClick={onAbrir}
                aria-haspopup="dialog"
                className="abrir-panel cursor-pointer text-left outline-none after:absolute after:inset-0 after:rounded-[inherit]"
              >
                {p.titulo}
              </button>
            </h3>
            {p.tituloOriginal !== p.titulo && <p className="mt-0.5 text-sm text-muted-foreground">{p.tituloOriginal}</p>}
          </div>
          <div className="flex flex-wrap gap-1.5">
            <Etiquetas p={p} />
          </div>
        </div>

        <p className="font-mono text-xs text-muted-foreground">{meta.join("  ·  ")}</p>

        {cronologia && (cronologia.epoca || cronologia.nota) && (
          <p className="text-sm">
            {cronologia.epoca && (
              <>
                Transcurre en <span className="font-mono font-medium text-neon">{cronologia.epoca}</span>
              </>
            )}
            {cronologia.nota && <span className="text-muted-foreground">{cronologia.epoca && " · "}{cronologia.nota}</span>}
          </p>
        )}

        {(p.directores.length > 0 || p.reparto.length > 0) && (
          <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[auto_1fr]">
            {p.directores.length > 0 && (
              <>
                <dt className="font-mono text-[11px] leading-5 tracking-wider text-muted-foreground uppercase">
                  {p.serie ? "Creación" : "Dirección"}
                </dt>
                <dd>{p.directores.join(", ")}</dd>
              </>
            )}
            {p.reparto.length > 0 && (
              <>
                <dt className="font-mono text-[11px] leading-5 tracking-wider text-muted-foreground uppercase">Reparto</dt>
                <dd>{p.reparto.join(", ")}</dd>
              </>
            )}
          </dl>
        )}

        {p.resumen && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.resumen}</p>}

        {(p.enlaces.wikipedia || p.enlaces.imdb) && (
          <p className="relative z-10 mt-auto flex w-fit gap-4 pt-1 text-sm">
            {p.enlaces.wikipedia && <Enlace href={p.enlaces.wikipedia}>Wikipedia</Enlace>}
            {p.enlaces.imdb && <Enlace href={p.enlaces.imdb}>IMDb</Enlace>}
          </p>
        )}
      </div>
    </Card>
  );
}

// "3 temporadas · 39 episodios"
export function temporadasEpisodios(s: NonNullable<PeliculaFila["serie"]>) {
  const partes = [
    s.temporadas && `${s.temporadas} ${s.temporadas === 1 ? "temporada" : "temporadas"}`,
    s.episodios && `${s.episodios} ${s.episodios === 1 ? "episodio" : "episodios"}`,
  ].filter(Boolean);
  return partes.join(" · ");
}

export function Etiquetas({ p }: { p: PeliculaFila }) {
  return (
    <>
      {p.serie && <Etiqueta tono="plasma">Serie</Etiqueta>}
      {p.proximamente && <Etiqueta tono="plasma">Próximamente</Etiqueta>}
      {p.serie?.enEmision && !p.proximamente && <Etiqueta>En emisión</Etiqueta>}
      {p.mcu && <Etiqueta tono="neon">MCU</Etiqueta>}
      {p.tipo === "animacion" && <Etiqueta>Animación</Etiqueta>}
      {p.formato === "tv-dvd" && <Etiqueta>TV / DVD</Etiqueta>}
    </>
  );
}

export function Etiqueta({ tono, children }: { tono?: "neon" | "plasma"; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "rounded-full border px-2 py-0.5 font-mono text-[10px] font-medium tracking-wider whitespace-nowrap uppercase transition-transform duration-300 ease-out group-hover/fila:scale-105",
        tono === "neon" && "border-neon/50 text-neon",
        tono === "plasma" && "border-plasma/50 text-plasma",
        !tono && "text-muted-foreground",
      )}
    >
      {children}
    </span>
  );
}

export function Enlace({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group/enlace enlace-linea inline-flex items-center gap-1 text-muted-foreground hover:text-neon"
    >
      {children}
      <ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover/enlace:translate-x-0.5 group-hover/enlace:-translate-y-0.5" />
    </a>
  );
}
