"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Revelar } from "@/components/revelar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { ModoListado } from "@/lib/listados";
import { ponerSeriesVisibles, useSeriesVisibles } from "@/lib/preferencias";

import { FilaPelicula, type PeliculaFila } from "./fila-pelicula";
import { PanelPelicula } from "./panel-pelicula";

type Orden = "antiguas" | "recientes";

// Minúsculas y sin tildes, para que "capitan" encuentre "Capitán"
function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Las series no van en el HTML: se piden la primera vez que se marca «Incluir series» (las genera
// app/datos/series.json/route.ts en el build) y se guardan para el resto de listados de la visita
const RUTA_SERIES = `${process.env.NEXT_PUBLIC_BASE_PATH?.replace(/\/$/, "") ?? ""}/datos/series.json`;
let peticionSeries: Promise<PeliculaFila[]> | null = null;

function cargarSeries() {
  peticionSeries ??= fetch(RUTA_SERIES)
    .then((r) => {
      if (!r.ok) throw new Error(`${r.status}`);
      return r.json() as Promise<PeliculaFila[]>;
    })
    .catch((e) => {
      peticionSeries = null; // se reintenta al volver a marcar la casilla
      throw e;
    });
  return peticionSeries;
}

// Mezcla dos listas ya ordenadas por fecha; a igual fecha, primero la película
function mezclarPorFecha(peliculas: PeliculaFila[], series: PeliculaFila[]) {
  const out: PeliculaFila[] = [];
  let i = 0;
  let j = 0;
  while (i < peliculas.length || j < series.length) {
    if (j >= series.length || (i < peliculas.length && peliculas[i].orden <= series[j].orden)) out.push(peliculas[i++]);
    else out.push(series[j++]);
  }
  return out;
}

// Orden cronológico: cada serie va detrás de su película (`cronologia.despuesDe`), en el orden de orden-cronologico.json;
// las que no tienen sitio en la línea temporal no salen
function mezclarPorCronologia(peliculas: PeliculaFila[], series: PeliculaFila[]) {
  const conSitio = series.filter((s) => s.cronologia);
  const detras = (id: string | null) =>
    conSitio.filter((s) => (s.cronologia!.despuesDe ?? null) === id).sort((a, b) => a.cronologia!.indice! - b.cronologia!.indice!);
  return [...detras(null), ...peliculas.flatMap((p) => [p, ...detras(p.id)])];
}

// Las películas llegan ya en el orden del listado (cronológico o de estreno); aquí solo se busca y se invierte.
// Con `series` aparece la casilla «Incluir series».
export function ListaPeliculas({
  peliculas,
  modo,
  series,
}: {
  peliculas: PeliculaFila[];
  modo: ModoListado;
  series?: { soloMcu: boolean };
}) {
  const verSeries = useSeriesVisibles() && Boolean(series);
  const [todasSeries, setTodasSeries] = useState<PeliculaFila[] | null>(null);
  const [errorSeries, setErrorSeries] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState<Orden>("antiguas");
  // Película del panel lateral; se guarda aparte de `abierto` para que siga pintada mientras el panel se cierra
  const [elegida, setElegida] = useState<PeliculaFila | null>(null);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!verSeries || todasSeries || errorSeries) return;
    let vigente = true;
    cargarSeries().then(
      (datos) => vigente && setTodasSeries(datos),
      () => vigente && setErrorSeries(true),
    );
    return () => {
      vigente = false;
    };
  }, [verSeries, todasSeries, errorSeries]);

  const seriesListado = verSeries && todasSeries ? todasSeries.filter((s) => !series?.soloMcu || s.mcu) : [];
  const base = !seriesListado.length
    ? peliculas
    : modo === "cronologico"
      ? mezclarPorCronologia(peliculas, seriesListado)
      : mezclarPorFecha(peliculas, seriesListado);
  const cargandoSeries = verSeries && !todasSeries && !errorSeries;

  const texto = normalizar(busqueda.trim());
  const visibles = base.filter(
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
            aria-label={verSeries ? "Buscar películas y series" : "Buscar películas"}
          />
        </div>
        {series && (
          <label className="flex h-8 cursor-pointer items-center gap-2 rounded-lg border px-2.5 text-sm whitespace-nowrap select-none transition-colors hover:bg-muted/60">
            <Checkbox
              checked={verSeries}
              onCheckedChange={(marcada) => {
                setErrorSeries(false);
                ponerSeriesVisibles(marcada);
              }}
            />
            Incluir series
          </label>
        )}
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

      <p className="mt-6 font-mono text-xs text-muted-foreground" aria-live="polite">
        {/* La key hace que el número se anime cada vez que cambia el resultado */}
        <Recuento n={visibles.filter((p) => !p.serie).length} singular="película" plural="películas" />
        {seriesListado.length > 0 && (
          <>
            {" y "}
            <Recuento n={visibles.filter((p) => p.serie).length} singular="serie" plural="series" />
          </>
        )}
        {texto && ` para «${busqueda.trim()}»`}
        {cargandoSeries && " · cargando series…"}
        {errorSeries && " · no se han podido cargar las series"}
      </p>

      <h2 className="sr-only">{seriesListado.length ? "Lista de películas y series" : "Lista de películas"}</h2>
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
        <p className="entrada py-12 text-center text-muted-foreground">
          No hay {seriesListado.length ? "películas ni series" : "películas"} con «{busqueda.trim()}». Prueba con otro título, director o actor.
        </p>
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

function Recuento({ n, singular, plural }: { n: number; singular: string; plural: string }) {
  return (
    <>
      <span key={n} className="entrada inline-block text-foreground">
        {n}
      </span>{" "}
      {n === 1 ? singular : plural}
    </>
  );
}
