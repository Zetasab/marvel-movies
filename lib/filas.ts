import type { PeliculaFila } from "@/components/peliculas/fila-pelicula";
import { getCronologiaSeries, getOrdenCronologico, getPeliculas, getSeries, type Pelicula, type Serie } from "@/lib/datos";
import { formatearDolares, formatearEstreno } from "@/lib/formato";
import { miniatura } from "@/lib/imagenes";
import type { Listado } from "@/lib/listados";

export type PeliculaListado = { pelicula: Pelicula; fila: PeliculaFila };

// Películas de un listado, ya en su orden (cronológico o de estreno) y con lo que pinta cada fila.
// Al cliente solo se le manda `fila`, con fechas y cifras ya formateadas en el servidor.
export function getPeliculasListado(listado: Pick<Listado, "modo" | "soloMcu">): PeliculaListado[] {
  const cronologia = getOrdenCronologico();
  const lista = getPeliculas()
    .filter((p) => !listado.soloMcu || p.mcu)
    .filter((p) => listado.modo !== "cronologico" || cronologia.has(p.id))
    .map((p) => ({ pelicula: p, fila: filaDe(p, cronologia) }));

  // peliculas.json ya viene por orden de estreno
  if (listado.modo === "cronologico") lista.sort((a, b) => a.fila.cronologia!.posicion! - b.fila.cronologia!.posicion!);
  return lista;
}

// Lo que pinta una fila de película (también la usan las fichas de personaje)
export function filaDe(p: Pelicula, cronologia = getOrdenCronologico()): PeliculaFila {
  return {
    id: p.id,
    titulo: p.titulo,
    tituloOriginal: p.tituloOriginal,
    anio: p.anio,
    estreno: formatearEstreno(p.fechaEstreno, p.anio),
    orden: p.fechaEstreno ?? String(p.anio),
    proximamente: p.proximamente,
    mcu: p.mcu,
    tipo: p.tipo,
    formato: p.formato,
    poster: miniatura(p.poster),
    directores: p.directores,
    reparto: p.reparto.slice(0, 4).map((r) => r.actor),
    duracionMin: p.duracionMin,
    recaudacion: formatearDolares(p.recaudacionUSD),
    resumen: p.sinopsis ?? p.resumen,
    enlaces: { wikipedia: p.enlaces.wikipediaEs ?? p.enlaces.wikipediaEn, imdb: p.enlaces.imdb },
    cronologia: cronologia.get(p.id) ?? null,
    serie: null,
    detalle: {
      guionistas: p.guionistas.slice(0, 6),
      reparto: p.reparto.slice(0, 12),
      generos: p.generos.filter((g) => g !== "cine de superhéroes"),
      productoras: p.productoras,
      presupuesto: formatearDolares(p.presupuestoUSD),
    },
  };
}

// ---------- series ----------
// No van en el HTML de las páginas: el listado las pide (/datos/series.json) solo si se marca «Incluir series».
// Así las páginas de películas no pesan más ni cambian lo que lee Google (títulos, recuento, JSON-LD de Movie).

export function getSeriesFilas(): PeliculaFila[] {
  const cronologia = getCronologiaSeries();
  return getSeries().map((s) => filaDeSerie(s, cronologia.get(s.id) ?? null));
}

function filaDeSerie(s: Serie, cronologia: PeliculaFila["cronologia"]): PeliculaFila {
  const emision = !s.anio
    ? "Fecha por anunciar"
    : s.enEmision
      ? `${s.anio}–actualidad`
      : !s.anioFin || s.anioFin === s.anio
        ? String(s.anio)
        : `${s.anio}–${s.anioFin}`;
  return {
    id: s.id,
    titulo: s.titulo,
    tituloOriginal: s.tituloOriginal,
    anio: s.anio,
    estreno: s.anio ? formatearEstreno(s.fechaEstreno, s.anio) : "Por anunciar",
    // Sin año, al final de la lista
    orden: s.fechaEstreno ?? String(s.anio ?? 9999),
    proximamente: s.proximamente,
    mcu: s.mcu,
    tipo: s.tipo,
    formato: "serie",
    poster: miniatura(s.poster),
    directores: s.creadores,
    reparto: s.reparto.slice(0, 4).map((r) => r.actor),
    duracionMin: s.duracionEpisodioMin,
    recaudacion: null,
    resumen: s.sinopsis ?? s.resumen,
    enlaces: { wikipedia: s.enlaces.wikipediaEs ?? s.enlaces.wikipediaEn, imdb: s.enlaces.imdb },
    cronologia,
    serie: { emision, enEmision: s.enEmision, temporadas: s.temporadas, episodios: s.episodios, cadenas: s.cadenas },
    detalle: {
      guionistas: s.guionistas.slice(0, 6),
      reparto: s.reparto.slice(0, 12),
      generos: s.generos.filter((g) => g !== "serie de superhéroes"),
      productoras: s.productoras,
      presupuesto: null,
    },
  };
}
