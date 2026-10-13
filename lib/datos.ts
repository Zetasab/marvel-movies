// Los JSON de data/ los genera scripts/actualizar-datos.mjs (en la carpeta superior del proyecto),
// salvo orden-cronologico.json, que se mantiene a mano.
// Se importan como módulos: forman parte del build (las páginas se pueden prerenderizar) y en `next dev`
// la página se recarga sola cuando el script los reescribe.
import peliculasJson from "@/data/peliculas.json";
import personajesJson from "@/data/personajes.json";
import cronologiaJson from "@/data/orden-cronologico.json";
import actualizacionJson from "@/data/ultima-actualizacion.json";

export type Pelicula = {
  id: string;
  titulo: string;
  tituloOriginal: string;
  anio: number;
  fechaEstreno: string | null; // "AAAA-MM-DD", "AAAA-MM" o null
  proximamente: boolean;
  tipo: "imagen-real" | "animacion";
  formato: "cine" | "tv-dvd";
  mcu: boolean;
  sagas: string[];
  directores: string[];
  guionistas: string[];
  reparto: { actor: string; personaje: string | null }[];
  generos: string[];
  productoras: string[];
  distribuidoras: string[];
  duracionMin: number | null;
  presupuestoUSD: number | null;
  recaudacionUSD: number | null;
  sinopsis: string | null;
  eslogan: string | null;
  resumen: string | null;
  poster: string | null;
  fondo: string | null;
  trailer: string | null;
  nota: number | null;
  anterior: string | null;
  siguiente: string | null;
  ids: { wikidata: string | null; imdb: string | null; tmdb: string | null };
  enlaces: { wikipediaEs: string | null; wikipediaEn: string | null; imdb: string | null };
};

export type Personaje = {
  id: string;
  nombre: string;
  principal: boolean;
  wikidata: string[];
  peliculas: string[]; // ids de Pelicula
};

export type UltimaActualizacion = {
  fecha: string; // ISO
  duracionSegundos: number;
  totalPeliculas: number;
  totalPersonajes: number;
  fuentes: string[];
};

export type EntradaCronologia = {
  wikidata: string;
  titulo: string; // solo para leer el JSON
  epoca: string | null; // cuándo transcurre, p. ej. "1943–1945"
  nota?: string;
};

// Los tipos que TypeScript infiere del JSON son demasiado amplios (string en vez de uniones, etc.)
export function getPeliculas() {
  return (peliculasJson as unknown as { peliculas: Pelicula[] }).peliculas;
}

export function getPersonajes() {
  return (personajesJson as unknown as { personajes: Personaje[] }).personajes;
}

export function getUltimaActualizacion() {
  return actualizacionJson as UltimaActualizacion;
}

// Orden cronológico del MCU: id de película -> posición (1, 2, 3...), época y nota
export function getOrdenCronologico() {
  const idPorWikidata = new Map(getPeliculas().map((p) => [p.ids.wikidata, p.id]));
  const orden = new Map<string, { posicion: number; epoca: string | null; nota: string | null }>();
  (cronologiaJson.peliculas as EntradaCronologia[]).forEach((e, i) => {
    const id = idPorWikidata.get(e.wikidata);
    if (id) orden.set(id, { posicion: i + 1, epoca: e.epoca, nota: e.nota ?? null });
  });
  return orden;
}
