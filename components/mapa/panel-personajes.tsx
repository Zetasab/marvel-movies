"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { PersonajeMapa } from "@/lib/mapa/layout";

export type ModoSeleccion = "principales" | "todos" | "ninguno";

export function PanelPersonajes({
  personajes,
  seleccion,
  cuentas,
  onSeleccionar,
  onAlternar,
  onHover,
}: {
  personajes: PersonajeMapa[];
  seleccion: Set<string>;
  cuentas: Map<string, number>; // películas de cada personaje dentro del ámbito actual
  onSeleccionar: (modo: ModoSeleccion) => void;
  onAlternar: (id: string, marcado: boolean) => void;
  onHover: (id: string | null) => void;
}) {
  const [filtro, setFiltro] = useState("");
  const texto = filtro.trim().toLowerCase();
  const candidatos = personajes.filter((c) => (cuentas.get(c.id) ?? 0) >= 2 && (!texto || c.nombre.toLowerCase().includes(texto)));
  const principales = candidatos.filter((c) => c.principal);
  const secundarios = candidatos.filter((c) => !c.principal);

  const fila = (c: PersonajeMapa) => (
    <li key={c.id}>
      <label
        className="group/fila flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-[background-color,translate] duration-200 hover:translate-x-0.5 hover:bg-muted"
        onMouseEnter={() => onHover(c.id)}
      >
        <Checkbox checked={seleccion.has(c.id)} onCheckedChange={(v) => onAlternar(c.id, v)} />
        <span className="h-1 w-3.5 shrink-0 rounded-full transition-[width,box-shadow] duration-300 group-hover/fila:w-5" style={{ background: c.color, boxShadow: `0 0 calc(var(--glow) * 8px) ${c.color}` }} />
        <span className="truncate">{c.nombre}</span>
        <span className="ml-auto font-mono text-xs text-muted-foreground tabular-nums">{cuentas.get(c.id)}</span>
      </label>
    </li>
  );

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-background/40 backdrop-blur-xl md:flex" onMouseLeave={() => onHover(null)}>
      <div className="space-y-2 border-b p-3">
        <h2 className="font-mono text-[11px] font-medium tracking-wider text-muted-foreground uppercase">Personajes</h2>
        <div className="grid grid-cols-3 gap-1">
          <Button variant="outline" size="xs" onClick={() => onSeleccionar("principales")}>
            Principales
          </Button>
          <Button variant="outline" size="xs" onClick={() => onSeleccionar("todos")}>
            Todos
          </Button>
          <Button variant="outline" size="xs" onClick={() => onSeleccionar("ninguno")}>
            Ninguno
          </Button>
        </div>
        <Input type="search" placeholder="Buscar personaje…" value={filtro} onChange={(e) => setFiltro(e.target.value)} />
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <ul className="p-1.5">
          {principales.map(fila)}
          {secundarios.length > 0 && (
            <li className="px-2 pt-3 pb-1 font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Secundarios</li>
          )}
          {secundarios.map(fila)}
        </ul>
      </ScrollArea>
    </aside>
  );
}
