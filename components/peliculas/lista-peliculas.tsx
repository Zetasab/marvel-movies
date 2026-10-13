"use client";

import { Search } from "lucide-react";
import { useState } from "react";

import { Revelar } from "@/components/revelar";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ModoListado } from "@/lib/listados";

import { FilaPelicula, type PeliculaFila } from "./fila-pelicula";
import { PanelPelicula } from "./panel-pelicula";

type Orden = "antiguas" | "recientes";

// Minúsculas y sin tildes, para que "capitan" encuentre "Capitán"
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Las películas llegan ya en el orden del listado (cronológico o de estreno); aquí solo se busca y se invierte
export function ListaPeliculas({ peliculas, modo }: { peliculas: PeliculaFila[]; modo: ModoListado }) {
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("antiguas");
  // Película del panel lateral; se guarda aparte de `abierto` para que siga pintada mientras el panel se cierra
  const [elegida, setElegida] = useState<PeliculaFila | null>(null);
  const [abierto, setAbierto] = useState(false);

  const texto = normalizar(busqueda.trim());
  const visibles = peliculas.filter(
    (p) => !texto || normalizar([p.titulo, p.tituloOriginal, ...p.directores, ...p.reparto].join(" ")).includes(texto),
  );
  if (orden === "recientes") visibles.reverse();

  // Anterior / siguiente según lo que se ve ahora en la lista (respeta búsqueda y orden)
  const posicion = elegida ? visibles.findIndex((p) => p.id === elegida.id) : -1;
  const irA = (i: number) => (posicion >= 0 && visibles[i] ? () => setElegida(visibles[i]) : null);

  return (
    <>
      <div className="cristal sticky top-16 z-10 mt-8 flex flex-wrap items-center gap-2 rounded-2xl px-3 py-3 shadow-lg shadow-black/5">
        <div className="group/buscar relative min-w-48 flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground transition-[color,scale] duration-300 group-focus-within/buscar:scale-110 group-focus-within/buscar:text-neon" />
          <Input
            type="search"
            placeholder="Buscar por título, director o actor…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-8"
            aria-label="Buscar películas"
          />
        </div>
        <ToggleGroup
          variant="outline"
          size="sm"
          value={[orden]}
          onValueChange={(v) => v[0] && setOrden(v[0] as Orden)}
          aria-label={modo === "cronologico" ? "Orden de la historia" : "Orden de estreno"}
        >
          <ToggleGroupItem value="antiguas">Más antiguas</ToggleGroupItem>
          <ToggleGroupItem value="recientes">Más recientes</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <p className="mt-6 font-mono text-xs text-muted-foreground">
        {/* La key hace que el número se anime cada vez que cambia el resultado */}
        <span key={visibles.length} className="entrada inline-block text-foreground">
          {visibles.length}
        </span>{" "}
        {visibles.length === 1 ? "película" : "películas"}
        {texto && ` para «${busqueda.trim()}»`}
      </p>

      <h2 className="sr-only">Lista de películas</h2>
      <ol className="mt-3 flex flex-col gap-4">
        {visibles.map((p, i) => (
          <li key={p.id}>
            {/* Aparecen al hacer scroll; las que entran a la vez se escalonan un poco */}
            <Revelar retraso={(i % 4) * 60}>
              <FilaPelicula
                pelicula={p}
                verCronologia={modo === "cronologico"}
                prioritaria={i < 2}
                onAbrir={() => {
                  setElegida(p);
                  setAbierto(true);
                }}
              />
            </Revelar>
          </li>
        ))}
      </ol>

      {visibles.length === 0 && (
        <p className="entrada py-12 text-center text-muted-foreground">No hay películas con «{busqueda.trim()}». Prueba con otro título, director o actor.</p>
      )}

      <PanelPelicula
        pelicula={elegida}
        abierto={abierto}
        verCronologia={modo === "cronologico"}
        onCerrar={() => setAbierto(false)}
        onAnterior={irA(posicion - 1)}
        onSiguiente={irA(posicion + 1)}
      />
    </>
  );
}
