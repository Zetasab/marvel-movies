// Disposición del mapa de relaciones: películas como tarjetas (x = fecha, y = franquicia)
// y "cables" de colores: cada personaje une sus películas en orden de estreno.
// En el MCU también puede ordenarse por la línea temporal de la historia (x = posición cronológica).

import type { Pelicula, Personaje } from "@/lib/datos";

// Claves de localStorage con las preferencias del mapa (se listan también en la política de privacidad)
export const CLAVES_MAPA = { ambito: "mapa.ambito", orden: "mapa.orden", seleccion: "mapa.seleccion", posiciones: "mapa.posiciones" };

export const TARJETA_W = 110;
export const POSTER_H = 160;
export const TARJETA_H = POSTER_H + 40;
export const CARRIL_H = 250;
const CARRIL_LABEL_W = 210;
const ANIO_W = 300; // px por año
const HUECO_MAX = 420; // máximo hueco horizontal entre dos películas consecutivas (comprime los años sin películas)
const SEPARACION = 30; // separación mínima entre tarjetas del mismo carril
const PUERTO_SEP = 7; // separación vertical entre cables que salen/entran de la misma tarjeta
const PASO_CRONO = TARJETA_W + 70; // en orden cronológico no hay fechas: cada película avanza un paso fijo

export type PeliculaMapa = Pick<
  Pelicula,
  "id" | "titulo" | "tituloOriginal" | "anio" | "fechaEstreno" | "proximamente" | "mcu" | "poster" | "directores" | "duracionMin" | "resumen" | "enlaces"
> & { cronologia: { posicion: number; epoca: string | null } | null }; // solo las del MCU que están en la línea temporal

export type PersonajeMapa = Pick<Personaje, "id" | "nombre" | "principal" | "peliculas"> & {
  color: string;
  interpretes: string[]; // actores que lo interpretan según el reparto (por número de películas)
};

export type Ambito = "mcu" | "todo";

export type Orden = "estreno" | "cronologico";

// Qué vista se está mirando: las posiciones arrastradas a mano se guardan por vista
export type Vista = "mcu" | "mcu-crono" | "todo";
// Enlace al mapa con los filtros ya puestos (?ambito=mcu&orden=cronologico&personaje=thor); lo lee MapaRelaciones al montar.
// Con `personaje` el mapa abre su ficha y resalta sus cables.
export function rutaMapa(filtros?: { ambito: Ambito; orden?: Orden; personaje?: string }) {
  if (!filtros) return "/mapa";
  const q = new URLSearchParams({ ambito: filtros.ambito });
  if (filtros.ambito === "mcu" && filtros.orden) q.set("orden", filtros.orden);
  if (filtros.personaje) q.set("personaje", filtros.personaje);
  return `/mapa?${q}`;
}

export function vistaDe(ambito: Ambito, orden: Orden): Vista {
  return ambito === "mcu" && orden === "cronologico" ? "mcu-crono" : ambito;
}

export type Posiciones = Record<string, { x: number; y: number }>;

export type Nodo = PeliculaMapa & { x: number; y: number };

export type Cable = {
  id: string;
  personaje: PersonajeMapa;
  origen: string; // id de película
  destino: string;
  offOrigen: number;
  offDestino: number;
};

export type Carril = { id: string; nombre: string; y: number };

export type Layout = {
  nodos: Nodo[];
  porId: Map<string, Nodo>;
  cables: Cable[];
  carriles: Carril[];
  marcasEje: { etiqueta: string; x: number }[]; // años (por estreno) o épocas (cronológico)
  ancho: number;
  alto: number;
};

// Carriles (filas) del mapa: cada película va al primero cuyo título original encaje
const FRANQUICIAS: { id: string; nombre: string; re: RegExp; soloMcu?: boolean }[] = [
  { id: "iron-man", nombre: "Iron Man", re: /iron man/i },
  { id: "hulk", nombre: "Hulk", re: /hulk/i },
  { id: "thor", nombre: "Thor", re: /\bthor\b/i },
  { id: "capitan-america", nombre: "Capitán América", re: /captain america/i },
  { id: "vengadores", nombre: "Vengadores", re: /avengers|thunderbolts/i },
  { id: "viuda-negra", nombre: "Viuda Negra", re: /black widow/i },
  { id: "capitana-marvel", nombre: "Capitana Marvel", re: /captain marvel|the marvels/i },
  { id: "guardianes", nombre: "Guardianes de la Galaxia", re: /guardians/i },
  { id: "ant-man", nombre: "Ant-Man", re: /ant-man/i },
  { id: "doctor-strange", nombre: "Doctor Strange", re: /strange/i },
  { id: "black-panther", nombre: "Black Panther", re: /black panther|wakanda/i },
  { id: "spider-man", nombre: "Spider-Man", re: /spider-man/i },
  { id: "sony", nombre: "Universo Sony", re: /venom|morbius|madame web|kraven/i },
  { id: "fantasticos", nombre: "Los 4 Fantásticos", re: /fantastic four/i },
  { id: "otros-mcu", nombre: "Otras del MCU", soloMcu: true, re: /./ },
  { id: "x-men", nombre: "X-Men", re: /x-men|\bx2\b|wolverine|logan|dark phoenix|new mutants|deadpool/i },
  { id: "knights", nombre: "Marvel Knights", re: /daredevil|elektra|punisher|ghost rider|blade|man-thing/i },
  { id: "otras", nombre: "Otras", re: /./ },
];

// Colores fijos para los personajes más conocidos (legibles en tema claro y oscuro); el resto se generan
const COLORES: Record<string, string> = {
  "iron-man": "#f2b53a",
  "capitan-america": "#3d7bff",
  thor: "#4fa3e0",
  hulk: "#4cc35a",
  "viuda-negra": "#d1355b",
  "ojo-de-halcon": "#9b59d0",
  "nick-fury": "#8a8f9c",
  "maquina-de-guerra": "#7c8696",
  falcon: "#e0644a",
  "soldado-de-invierno": "#5f7d99",
  "bruja-escarlata": "#ff4d6d",
  vision: "#d4b20a",
  "ant-man": "#ff7a45",
  avispa: "#f0a630",
  "spider-man": "#ff3b30",
  "doctor-strange": "#ff9f1c",
  "black-panther": "#a06cff",
  "capitana-marvel": "#ff5fa2",
  "star-lord": "#2ec4b6",
  loki: "#2a9d4b",
  thanos: "#b48cd9",
  wolverine: "#e6b400",
  deadpool: "#e5383b",
  "profesor-x": "#7ec4cf",
  magneto: "#c77dff",
  "mister-fantastico": "#4ea8de",
  venom: "#8e95a3",
  blade: "#8d99ae",
  "ghost-rider": "#ff6d00",
  punisher: "#a8adb8",
};

export function colorDe(personajeId: string, indice: number) {
  return COLORES[personajeId] ?? `hsl(${Math.round((indice * 137.508) % 360)} 65% 55%)`;
}

export function fechaNum(p: Pick<Pelicula, "fechaEstreno" | "anio">) {
  const [a, m = "07", d = "01"] = (p.fechaEstreno ?? `${p.anio}-07-01`).split("-");
  return Number(a) + (Number(m) - 1) / 12 + (Number(d) - 1) / 365;
}

function franquiciaDe(p: PeliculaMapa) {
  return FRANQUICIAS.find((f) => (!f.soloMcu || p.mcu) && f.re.test(p.tituloOriginal))!.id;
}

export function enAmbito(p: Pick<Pelicula, "mcu">, ambito: Ambito) {
  return ambito === "todo" || p.mcu;
}

export function calcularLayout(
  peliculas: PeliculaMapa[],
  personajes: PersonajeMapa[],
  vista: Vista,
  seleccion: Set<string>,
  posiciones: Posiciones,
): Layout {
  const porIdTodas = new Map(peliculas.map((p) => [p.id, p]));
  const ambito: Ambito = vista === "todo" ? "todo" : "mcu";
  const crono = vista === "mcu-crono";
  // Las del MCU que no están en la línea temporal van al final, por fecha
  const clave = (p: PeliculaMapa) => (crono ? (p.cronologia?.posicion ?? 1000 + fechaNum(p)) : fechaNum(p));

  // Cables: cada personaje une sus películas visibles consecutivas
  const cables: Cable[] = [];
  const conPersonaje = new Set<string>();
  for (const c of personajes) {
    if (!seleccion.has(c.id)) continue;
    const pelis = c.peliculas
      .map((id) => porIdTodas.get(id))
      .filter((p): p is PeliculaMapa => !!p && enAmbito(p, ambito))
      .sort((a, b) => clave(a) - clave(b));
    pelis.forEach((p) => conPersonaje.add(p.id));
    for (let i = 1; i < pelis.length; i++) {
      cables.push({ id: `${c.id}:${pelis[i - 1].id}`, personaje: c, origen: pelis[i - 1].id, destino: pelis[i].id, offOrigen: 0, offDestino: 0 });
    }
  }

  // En el MCU se muestran todas; en "Todo Marvel" solo las que tienen algún personaje seleccionado
  const visibles = peliculas
    .filter((p) => enAmbito(p, ambito) && (ambito === "mcu" || conPersonaje.has(p.id)))
    .sort((a, b) => clave(a) - clave(b));

  const usados = new Set(visibles.map(franquiciaDe));
  const carriles = FRANQUICIAS.filter((f) => usados.has(f.id)).map((f, i) => ({ id: f.id, nombre: f.nombre, y: i * CARRIL_H }));
  const yCarril = new Map(carriles.map((c) => [c.id, c.y]));

  // X por fecha comprimiendo los huecos largos (o a paso fijo en orden cronológico);
  // después se evita que se pisen tarjetas del mismo carril
  const marcas: [number, number][] = [];
  let x = CARRIL_LABEL_W;
  visibles.forEach((p, i) => {
    if (i > 0) x += crono ? PASO_CRONO : Math.min((fechaNum(p) - fechaNum(visibles[i - 1])) * ANIO_W, HUECO_MAX);
    marcas.push([fechaNum(p), x]);
  });

  const ultimoX = new Map<string, number>();
  const nodos: Nodo[] = visibles.map((p, i) => {
    const carril = franquiciaDe(p);
    const xAuto = Math.max(marcas[i][1], (ultimoX.get(carril) ?? -Infinity) + TARJETA_W + SEPARACION);
    ultimoX.set(carril, xAuto);
    const manual = posiciones[`${vista}:${p.id}`];
    return { ...p, x: manual?.x ?? xAuto, y: manual?.y ?? yCarril.get(carril)! + (CARRIL_H - TARJETA_H) / 2 };
  });
  const porId = new Map(nodos.map((n) => [n.id, n]));

  asignarPuertos(cables, porId);

  return {
    nodos,
    porId,
    cables,
    carriles,
    marcasEje: crono ? ejeDeEpocas(visibles.map((p, i) => ({ epoca: p.cronologia?.epoca ?? null, x: marcas[i][1] }))) : ejeDeAnios(marcas),
    ancho: Math.max(...nodos.map((n) => n.x + TARJETA_W), 800) + 200,
    alto: carriles.length * CARRIL_H,
  };
}

// Reparte los puntos de conexión de cada tarjeta para que los cables no salgan todos del mismo punto
function asignarPuertos(cables: Cable[], porId: Map<string, Nodo>) {
  const salidas = new Map<string, Cable[]>();
  const entradas = new Map<string, Cable[]>();
  for (const c of cables) {
    if (!salidas.has(c.origen)) salidas.set(c.origen, []);
    if (!entradas.has(c.destino)) entradas.set(c.destino, []);
    salidas.get(c.origen)!.push(c);
    entradas.get(c.destino)!.push(c);
  }
  for (const lista of salidas.values()) {
    lista.sort((a, b) => porId.get(a.destino)!.y - porId.get(b.destino)!.y || porId.get(a.destino)!.x - porId.get(b.destino)!.x);
    lista.forEach((c, i) => (c.offOrigen = (i - (lista.length - 1) / 2) * PUERTO_SEP));
  }
  for (const lista of entradas.values()) {
    lista.sort((a, b) => porId.get(a.origen)!.y - porId.get(b.origen)!.y || porId.get(a.origen)!.x - porId.get(b.origen)!.x);
    lista.forEach((c, i) => (c.offDestino = (i - (lista.length - 1) / 2) * PUERTO_SEP));
  }
}

function ejeDeAnios(marcas: [number, number][]) {
  if (!marcas.length) return [];
  const xDeAnio = (anio: number) => {
    for (let i = 1; i < marcas.length; i++) {
      if (marcas[i][0] >= anio) {
        const [f0, x0] = marcas[i - 1];
        const [f1, x1] = marcas[i];
        return f1 === f0 ? x1 : x0 + ((anio - f0) / (f1 - f0)) * (x1 - x0);
      }
    }
    return null;
  };
  const anios: { etiqueta: string; x: number }[] = [];
  let ultimaX = -Infinity;
  for (let a = Math.ceil(marcas[0][0]); a <= Math.floor(marcas.at(-1)![0]); a++) {
    const x = xDeAnio(a);
    if (x === null || x - ultimaX < 50) continue;
    ultimaX = x;
    anios.push({ etiqueta: String(a), x });
  }
  return anios;
}

// Una marca por época de la línea temporal (cuando cambia respecto a la película anterior), sobre su primera película
function ejeDeEpocas(pelis: { epoca: string | null; x: number }[]) {
  const marcas: { etiqueta: string; x: number }[] = [];
  let anterior: string | null = null;
  for (const { epoca, x } of pelis) {
    if (!epoca || epoca === anterior) continue;
    anterior = epoca;
    marcas.push({ etiqueta: epoca, x });
  }
  return marcas;
}

export function puntosCable(c: Cable, origen: { x: number; y: number }, destino: { x: number; y: number }) {
  const x1 = origen.x + TARJETA_W;
  const y1 = origen.y + POSTER_H / 2 + c.offOrigen;
  const x2 = destino.x;
  const y2 = destino.y + POSTER_H / 2 + c.offDestino;
  const dx = Math.max(60, Math.abs(x2 - x1) * 0.45);
  return { x1, y1, x2, y2, d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}` };
}


export function partirTitulo(texto: string, max = 17) {
  const lineas = [""];
  for (const w of texto.split(" ")) {
    const actual = lineas[lineas.length - 1];
    if ((actual + " " + w).trim().length > max && actual) lineas.push(w);
    else lineas[lineas.length - 1] = (actual + " " + w).trim();
  }
  if (lineas.length > 2) {
    lineas.length = 2;
    lineas[1] = lineas[1].slice(0, max - 1) + "…";
  }
  return lineas;
}
