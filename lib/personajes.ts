// Fichas de personaje (páginas /personajes/<id> y panel del mapa): sus películas, quién lo interpreta
// y con qué otros personajes coincide. Todo sale de personajes.json + peliculas.json.
import { getPeliculas, getPersonajes, type Pelicula, type Personaje } from "@/lib/datos";
import { colorDe } from "@/lib/mapa/layout";

export type FichaPersonaje = {
  personaje: Personaje;
  color: string;
  // El nombre, o con sus años si otro personaje se llama igual (Wikidata separa versiones: Ben Grimm de 2005 y de 2025).
  // Si uno de los homónimos sale en más películas, ese se queda con el nombre tal cual
  titulo: string;
  peliculas: Pelicula[]; // por orden de estreno
  interpretes: string[];
  companeros: { personaje: Personaje; juntos: number }[]; // con quién comparte más películas
};

export { rutaPersonaje } from "@/lib/rutas";

// Minúsculas y sin tildes
function normalizar(t: string) {
  return t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
}

// Actores que lo interpretan. Si personajes.json aún no los trae (datos generados antes de añadirlos), plan B:
// en el reparto el personaje viene con el nombre de Wikidata ("Thor", "Nick Fury / ..."), así que solo se
// cuentan las coincidencias exactas con el nombre
export function interpretesDe(c: Personaje, peliculas: Pelicula[]) {
  if (c.interpretes) return c.interpretes;
  const buscado = normalizar(c.nombre);
  const cuentas = new Map<string, number>();
  for (const p of peliculas)
    for (const r of p.reparto)
      if (r.personaje?.split("/").some((parte) => normalizar(parte) === buscado))
        cuentas.set(r.actor, (cuentas.get(r.actor) ?? 0) + 1);
  return [...cuentas].sort((a, b) => b[1] - a[1]).map(([actor]) => actor);
}

let cache: Map<string, FichaPersonaje> | null = null;

export function getFichasPersonaje(): Map<string, FichaPersonaje> {
  if (cache) return cache;
  const personajes = getPersonajes();
  const peliculas = getPeliculas();
  // peliculas.json ya viene por orden de estreno
  const orden = new Map(peliculas.map((p, i) => [p.id, i]));
  const porId = new Map(peliculas.map((p) => [p.id, p]));
  // Homónimos que necesitan los años en el título: todos menos el que sale en más películas (si no hay empate)
  const conAnios = new Set<string>();
  for (const nombre of new Set(personajes.map((c) => c.nombre))) {
    const mismos = personajes.filter((c) => c.nombre === nombre).sort((a, b) => b.peliculas.length - a.peliculas.length);
    if (mismos.length < 2) continue;
    const empate = mismos[0].peliculas.length === mismos[1].peliculas.length;
    for (const c of empate ? mismos : mismos.slice(1)) conAnios.add(c.id);
  }

  cache = new Map(
    personajes.map((c, i) => {
      const suyas = c.peliculas
        .map((id) => porId.get(id))
        .filter((p) => p !== undefined)
        .sort((a, b) => orden.get(a.id)! - orden.get(b.id)!);
      const mias = new Set(c.peliculas);
      const companeros = personajes
        .filter((o) => o.id !== c.id)
        .map((o) => ({ personaje: o, juntos: o.peliculas.filter((id) => mias.has(id)).length }))
        .filter((x) => x.juntos >= 2)
        .sort((a, b) => b.juntos - a.juntos || Number(b.personaje.principal) - Number(a.personaje.principal))
        .slice(0, 8);
      const [desde, hasta] = [suyas[0]?.anio, suyas.at(-1)?.anio];
      const titulo = conAnios.has(c.id) ? `${c.nombre} (${desde === hasta ? desde : `${desde}–${hasta}`})` : c.nombre;
      return [
        c.id,
        { personaje: c, color: colorDe(c.id, i), titulo, peliculas: suyas, interpretes: interpretesDe(c, suyas), companeros },
      ];
    }),
  );
  return cache;
}

export function getFichaPersonaje(id: string) {
  return getFichasPersonaje().get(id);
}
