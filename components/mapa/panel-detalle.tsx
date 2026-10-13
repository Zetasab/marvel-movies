"use client";

import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { miniatura } from "@/lib/imagenes";
import type { Nodo, PersonajeMapa } from "@/lib/mapa/layout";

export type Conexion = { pelicula: Nodo; personajes: PersonajeMapa[] };

export function PanelDetalle({
  pelicula: p,
  personajes,
  seleccion,
  vieneDe,
  continuaEn,
  onCerrar,
  onIr,
}: {
  pelicula: Nodo;
  personajes: PersonajeMapa[];
  seleccion: Set<string>;
  vieneDe: Conexion[];
  continuaEn: Conexion[];
  onCerrar: () => void;
  onIr: (id: string) => void;
}) {
  const ordenados = [...personajes].sort(
    (a, b) => Number(seleccion.has(b.id)) - Number(seleccion.has(a.id)) || Number(b.principal) - Number(a.principal),
  );
  const meta = [p.anio, p.directores.join(", "), p.duracionMin && `${p.duracionMin} min`].filter(Boolean);
  const poster = miniatura(p.poster);

  return (
    <aside className="absolute inset-y-0 right-0 z-20 w-[min(320px,90vw)] animate-in border-l bg-background/75 backdrop-blur-xl duration-300 fade-in slide-in-from-right-6 md:static md:w-80">
      <ScrollArea className="h-full">
        <div className="space-y-4 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-display text-lg leading-tight font-semibold">{p.titulo}</h3>
              {p.tituloOriginal !== p.titulo && <p className="text-sm text-muted-foreground italic">{p.tituloOriginal}</p>}
              <p className="mt-1 font-mono text-xs text-muted-foreground">{meta.join(" · ")}</p>
              <div className="mt-2 flex gap-1.5">
                {p.mcu && (
                  <Badge variant="outline" className="border-neon/50 font-mono text-[10px] tracking-wider text-neon uppercase">
                    MCU
                  </Badge>
                )}
                {p.proximamente && (
                  <Badge variant="outline" className="border-plasma/50 font-mono text-[10px] tracking-wider text-plasma uppercase">
                    Próximamente
                  </Badge>
                )}
              </div>
            </div>
            <Button variant="ghost" size="icon-sm" onClick={onCerrar} aria-label="Cerrar">
              <X />
            </Button>
          </div>

          {poster && (
            // eslint-disable-next-line @next/next/no-img-element -- póster externo de Wikipedia, sin optimizar
            <img src={poster} alt={`Póster de ${p.titulo}`} decoding="async" width={330} height={495} className="aspect-2/3 w-full rounded-xl border object-cover" />
          )}

          <ListaConexiones titulo="Viene de" flecha="←" conexiones={vieneDe} onIr={onIr} />
          <ListaConexiones titulo="Continúa en" flecha="→" conexiones={continuaEn} onIr={onIr} />

          {ordenados.length > 0 && (
            <section>
              <h4 className="mb-2 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Personajes</h4>
              <div className="flex flex-wrap gap-1.5">
                {ordenados.map((c) => (
                  <Badge key={c.id} variant="outline" className="gap-1.5">
                    <span
                      className="size-2 rounded-full border"
                      style={{ borderColor: c.color, background: seleccion.has(c.id) ? c.color : "transparent" }}
                    />
                    {c.nombre}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {p.resumen && (
            <section>
              <h4 className="mb-2 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Resumen</h4>
              <p className="text-sm leading-relaxed text-muted-foreground">{p.resumen}</p>
            </section>
          )}

          <p className="flex gap-3 text-sm">
            {p.enlaces.wikipediaEs && (
              <a href={p.enlaces.wikipediaEs} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                Wikipedia
              </a>
            )}
            {p.enlaces.imdb && (
              <a href={p.enlaces.imdb} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                IMDb
              </a>
            )}
          </p>
        </div>
      </ScrollArea>
    </aside>
  );
}

function ListaConexiones({
  titulo,
  flecha,
  conexiones,
  onIr,
}: {
  titulo: string;
  flecha: string;
  conexiones: Conexion[];
  onIr: (id: string) => void;
}) {
  if (!conexiones.length) return null;
  return (
    <section>
      <h4 className="mb-2 font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">{titulo}</h4>
      <ul className="space-y-2 text-sm">
        {conexiones.map(({ pelicula, personajes }) => (
          <li key={pelicula.id}>
            {flecha}{" "}
            <button className="underline decoration-border underline-offset-4 transition-colors hover:text-neon hover:decoration-neon" onClick={() => onIr(pelicula.id)}>
              {pelicula.titulo}
            </button>{" "}
            <span className="text-muted-foreground">({pelicula.anio})</span>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {personajes.map((c, i) => (
                <span key={c.id}>
                  {i > 0 && " · "}
                  <span style={{ color: c.color }}>●</span> {c.nombre}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
