import type { PeliculaFila } from "@/components/peliculas/fila-pelicula";
import { getOrdenCronologico, getPeliculas, type Pelicula } from "@/lib/datos";
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
    .map((p) => ({
      pelicula: p,
      fila: {
        id: p.id,
        titulo: p.titulo,
        tituloOriginal: p.tituloOriginal,
        anio: p.anio,
        estreno: formatearEstreno(p.fechaEstreno, p.anio),
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
        detalle: {
          guionistas: p.guionistas.slice(0, 6),
          reparto: p.reparto.slice(0, 12),
          generos: p.generos.filter((g) => g !== "cine de superhéroes"),
          productoras: p.productoras,
          presupuesto: formatearDolares(p.presupuestoUSD),
        },
      },
    }));

  // peliculas.json ya viene por orden de estreno
  if (listado.modo === "cronologico") lista.sort((a, b) => a.fila.cronologia!.posicion - b.fila.cronologia!.posicion);
  return lista;
}
