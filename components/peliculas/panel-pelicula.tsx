"use client";

import { Drawer } from "@base-ui/react/drawer";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Enlace, Etiqueta, type PeliculaFila } from "./fila-pelicula";

// Panel lateral con la ficha de una película (se abre al pulsar una card del listado).
// `pelicula` se mantiene mientras se cierra para que la animación de salida no se quede en blanco.
export function PanelPelicula({
  pelicula: p,
  abierto,
  verCronologia,
  onCerrar,
  onAnterior,
  onSiguiente,
}: {
  pelicula: PeliculaFila | null;
  abierto: boolean;
  verCronologia: boolean;
  onCerrar: () => void;
  onAnterior: (() => void) | null;
  onSiguiente: (() => void) | null;
}) {
  return (
    <Drawer.Root open={abierto} onOpenChange={(o) => !o && onCerrar()} swipeDirection="right">
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black/40 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-[2px] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 dark:bg-black/60" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-stretch justify-end">
          <Drawer.Popup
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft" && onAnterior) onAnterior();
              if (e.key === "ArrowRight" && onSiguiente) onSiguiente();
            }}
            className="h-full w-[min(420px,92vw)] [transform:translateX(var(--drawer-swipe-movement-x))] overflow-y-auto overscroll-contain border-l bg-background/80 shadow-2xl shadow-black/30 outline-none backdrop-blur-xl transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateX(100%)] data-starting-style:[transform:translateX(100%)] data-swiping:select-none motion-reduce:duration-0"
          >
            {p && <Ficha p={p} verCronologia={verCronologia} onAnterior={onAnterior} onSiguiente={onSiguiente} />}
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Ficha({
  p,
  verCronologia,
  onAnterior,
  onSiguiente,
}: {
  p: PeliculaFila;
  verCronologia: boolean;
  onAnterior: (() => void) | null;
  onSiguiente: (() => void) | null;
}) {
  const d = p.detalle;
  const cronologia = verCronologia ? p.cronologia : null;
  const datos = [
    ["Estreno", p.estreno],
    ["Duración", p.duracionMin && `${p.duracionMin} min`],
    ["Recaudación", p.recaudacion],
    ["Presupuesto", d.presupuesto],
    ["Transcurre en", cronologia?.epoca],
  ].filter((x): x is [string, string] => Boolean(x[1]));

  return (
    <>
      {/* Cabecera fija: navegación entre películas y cerrar */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b bg-background/70 px-3 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={onAnterior ?? undefined} disabled={!onAnterior} aria-label="Película anterior">
            <ChevronLeft />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onSiguiente ?? undefined} disabled={!onSiguiente} aria-label="Película siguiente">
            <ChevronRight />
          </Button>
          {cronologia && (
            <span className="ml-1 font-mono text-xs font-semibold text-neon tabular-nums">
              #{String(cronologia.posicion).padStart(2, "0")}
            </span>
          )}
        </div>
        <Drawer.Close render={<Button variant="ghost" size="icon-sm" aria-label="Cerrar" />}>
          <X />
        </Drawer.Close>
      </div>

      {/* La key reinicia la animación de entrada al pasar a otra película */}
      <div key={p.id} className="entrada space-y-6 p-5">
        <div className="flex gap-4">
          <div className="relative aspect-2/3 w-28 shrink-0 overflow-hidden rounded-xl bg-muted shadow-lg ring-1 shadow-black/20 ring-foreground/10">
            {p.poster ? (
              // eslint-disable-next-line @next/next/no-img-element -- póster externo de Wikipedia, sin optimizar
              <img src={p.poster} alt={`Póster de ${p.titulo}`} decoding="async" className="absolute inset-0 size-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-2 text-center font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                Sin póster
              </div>
            )}
          </div>
          <div className="min-w-0">
            <Drawer.Title className="font-display text-xl leading-tight font-semibold text-balance">{p.titulo}</Drawer.Title>
            {p.tituloOriginal !== p.titulo && <p className="mt-1 text-sm text-muted-foreground">{p.tituloOriginal}</p>}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {p.proximamente && <Etiqueta tono="plasma">Próximamente</Etiqueta>}
              {p.mcu && <Etiqueta tono="neon">MCU</Etiqueta>}
              {p.tipo === "animacion" && <Etiqueta>Animación</Etiqueta>}
              {p.formato === "tv-dvd" && <Etiqueta>TV / DVD</Etiqueta>}
            </div>
            {cronologia?.nota && <p className="mt-3 text-sm text-muted-foreground">{cronologia.nota}</p>}
          </div>
        </div>

        {datos.length > 0 && (
          <dl className="grid grid-cols-2 gap-2">
            {datos.map(([t, v]) => (
              <div key={t} className="rounded-xl border bg-card/50 px-3 py-2">
                <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{t}</dt>
                <dd className="mt-0.5 text-sm font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        )}

        {p.resumen && (
          <Seccion titulo="Resumen">
            <Drawer.Description className="text-sm leading-relaxed text-pretty text-muted-foreground">{p.resumen}</Drawer.Description>
          </Seccion>
        )}

        {d.reparto.length > 0 && (
          <Seccion titulo="Reparto">
            <ul className="grid gap-x-4 gap-y-1.5 text-sm sm:grid-cols-2">
              {d.reparto.map((r) => (
                <li key={r.actor} className="min-w-0">
                  <span className="font-medium">{r.actor}</span>
                  {r.personaje && <span className="block truncate text-xs text-muted-foreground">{r.personaje}</span>}
                </li>
              ))}
            </ul>
          </Seccion>
        )}

        {(p.directores.length > 0 || d.guionistas.length > 0 || d.productoras.length > 0) && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
            {[
              ["Dirección", p.directores],
              ["Guion", d.guionistas],
              ["Producción", d.productoras],
            ].map(
              ([t, v]) =>
                v.length > 0 && (
                  <div key={t as string} className="contents">
                    <dt className="font-mono text-[11px] leading-5 tracking-wider text-muted-foreground uppercase">{t}</dt>
                    <dd>{(v as string[]).join(", ")}</dd>
                  </div>
                ),
            )}
          </dl>
        )}

        {d.generos.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {d.generos.map((g) => (
              <span key={g} className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground first-letter:uppercase">
                {g.replace(/^cine de /, "")}
              </span>
            ))}
          </div>
        )}

        {(p.enlaces.wikipedia || p.enlaces.imdb) && (
          <p className="flex gap-4 border-t pt-4 text-sm">
            {p.enlaces.wikipedia && <Enlace href={p.enlaces.wikipedia}>Wikipedia</Enlace>}
            {p.enlaces.imdb && <Enlace href={p.enlaces.imdb}>IMDb</Enlace>}
          </p>
        )}
      </div>
    </>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-2 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{titulo}</h3>
      {children}
    </section>
  );
}
