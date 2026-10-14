"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { miniatura } from "@/lib/imagenes";
import type { PeliculaMapa, PersonajeMapa } from "@/lib/mapa/layout";
import { rutaPersonaje } from "@/lib/rutas";
import { cn } from "@/lib/utils";

// Panel lateral con la ficha de un personaje (se abre al pulsar uno de sus cables en el mapa).
// `peliculas` ya viene ordenada según la vista; `enMapa` dice cuáles se pueden centrar en el lienzo.
export function PanelPersonaje({
  personaje: c,
  peliculas,
  enMapa,
  seleccionado,
  onCerrar,
  onIr,
}: {
  personaje: PersonajeMapa;
  peliculas: PeliculaMapa[];
  enMapa: Set<string>;
  seleccionado: boolean;
  onCerrar: () => void;
  onIr: (id: string) => void;
}) {
  const estrenadas = peliculas.filter((p) => !p.proximamente);
  const porAnio = [...estrenadas].sort((a, b) => a.anio - b.anio);
  const datos = [
    ["Películas", String(peliculas.length)],
    ["En el mapa", String(peliculas.filter((p) => enMapa.has(p.id)).length)],
    ["Primera", porAnio[0] && String(porAnio[0].anio)],
    ["Última", porAnio.at(-1) && String(porAnio.at(-1)!.anio)],
  ].filter((x): x is [string, string] => Boolean(x[1]));

  return (
    <aside className="absolute inset-y-0 right-0 z-20 w-[min(320px,90vw)] animate-in border-l bg-background/75 backdrop-blur-xl duration-300 fade-in slide-in-from-right-6 md:static md:w-80">
      <ScrollArea className="h-full">
        {/* La key reinicia la animación de entrada al pasar a otro personaje */}
        <div key={c.id} className="entrada space-y-4 p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="size-3 shrink-0 rounded-full"
                  style={{ background: c.color, boxShadow: `0 0 calc(var(--glow) * 10px) ${c.color}` }}
                />
                <h3 className="font-display text-lg leading-tight font-semibold">{c.nombre}</h3>
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {c.principal && (
                  <Badge variant="outline" className="border-neon/50 font-mono text-[10px] tracking-wider text-neon uppercase">
                    Principal
                  </Badge>
                )}
                {!seleccionado && (
                  <Badge variant="outline" className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                    Oculto en el mapa
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onCerrar} aria-label="Cerrar">
              <X />
            </Button>
          </div>

          {/* Línea del color del personaje, como sus cables */}
          <div className="h-1 rounded-full" style={{ background: c.color, opacity: 0.85 }} />

          <dl className="grid grid-cols-2 gap-2">
            {datos.map(([t, v]) => (
              <div key={t} className="rounded-xl border bg-card/50 px-3 py-2">
                <dt className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">{t}</dt>
                <dd className="mt-0.5 text-sm font-medium tabular-nums">{v}</dd>
              </div>
            ))}
          </dl>

          <Link
            href={rutaPersonaje(c.id)}
            className="group flex items-center justify-between gap-2 rounded-xl border bg-card/50 px-3 py-2 text-sm font-medium transition-colors hover:border-neon/50 hover:text-neon"
          >
            Ver ficha completa
            <ArrowRight className="size-4 text-neon transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {c.interpretes.length > 0 && (
            <section>
              <h4 className="mb-2 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Interpretado por</h4>
              <p className="text-sm">{c.interpretes.join(", ")}</p>
            </section>
          )}

          <section>
            <h4 className="mb-2 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Aparece en</h4>
            <ol className="space-y-1">
              {peliculas.map((p) => {
                const visible = enMapa.has(p.id);
                const poster = miniatura(p.poster);
                return (
                  <li key={p.id}>
                    <button
                      onClick={() => visible && onIr(p.id)}
                      disabled={!visible}
                      title={visible ? "Ver en el mapa" : "No está en el mapa con los filtros actuales"}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-lg p-1.5 text-left transition-colors",
                        visible ? "hover:bg-foreground/5" : "cursor-default opacity-50",
                      )}
                    >
                      <span className="relative aspect-2/3 w-9 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-foreground/10">
                        {poster && (
                          // eslint-disable-next-line @next/next/no-img-element -- póster externo de Wikipedia, sin optimizar
                          <img src={poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm font-medium",
                            visible && "underline decoration-transparent underline-offset-4 transition-colors group-hover:text-neon group-hover:decoration-neon",
                          )}
                        >
                          {p.titulo}
                        </span>
                        <span className="block font-mono text-[11px] text-muted-foreground">
                          {p.anio}
                          {p.proximamente && <span className="text-plasma"> · Próximamente</span>}
                          {p.mcu && <span className="text-neon"> · MCU</span>}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>
      </ScrollArea>
    </aside>
  );
}
