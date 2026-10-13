// Las páginas de listados de películas. Cada una es una URL propia pensada para SEO (título, descripción y texto
// adaptados a lo que la gente busca). El menú, las páginas, el sitemap y los enlaces cruzados salen de aquí.

export type ModoListado = "cronologico" | "estreno";

export type Listado = {
  ruta: string;
  menu: string; // texto corto para el menú
  h1: string;
  enlace: string; // para enlazarlo dentro de una frase ("aquí tienes las …")
  modo: ModoListado;
  soloMcu: boolean;
  // Funciones porque dependen de los datos (número de películas y año de la última actualización).
  // Los títulos empiezan por lo que la gente busca en Google ("orden cronológico marvel", "películas de marvel en orden")
  // y llevan el año, que pesa en búsquedas que cambian cada temporada.
  titulo: (n: number, anio: number) => string; // <title>
  descripcion: (n: number) => string; // meta description (~155 caracteres)
};

export const LISTADOS: Listado[] = [
  {
    ruta: "/peliculas/mcu-orden-cronologico",
    menu: "MCU en orden cronológico",
    h1: "Películas de Marvel en orden cronológico",
    enlace: "películas del MCU en orden cronológico",
    modo: "cronologico",
    soloMcu: true,
    titulo: (n, anio) => `Orden cronológico de Marvel (${anio}): las ${n} películas del MCU`,
    descripcion: (n) =>
      `Cómo ver las ${n} películas de Marvel en orden cronológico, según la línea temporal oficial del MCU: desde Capitán América (1943) hasta hoy, con la época de cada una.`,
  },
  {
    ruta: "/peliculas/mcu-orden-de-estreno",
    menu: "MCU por orden de estreno",
    h1: "Películas de Marvel por orden de estreno",
    enlace: "películas del MCU por orden de estreno",
    modo: "estreno",
    soloMcu: true,
    titulo: (n, anio) => `Películas de Marvel por orden de estreno (${anio}): las ${n} del MCU`,
    descripcion: (n) =>
      `Las ${n} películas del MCU en el orden en que se estrenaron, de Iron Man (2008) a los próximos estrenos de Marvel Studios. Con fechas, duración, reparto y buscador.`,
  },
  {
    ruta: "/peliculas/marvel-orden-de-estreno",
    menu: "Todas las de Marvel por estreno",
    h1: "Todas las películas de Marvel en orden",
    enlace: "películas de Marvel de todos los estudios",
    modo: "estreno",
    soloMcu: false,
    titulo: (n, anio) => `Todas las películas de Marvel en orden (${anio}): lista completa de ${n}`,
    descripcion: (n) =>
      `Lista completa de las ${n} películas basadas en Marvel Comics por orden de estreno: MCU, Spider-Man y Venom de Sony, X-Men y Deadpool de Fox, animación y telefilmes.`,
  },
];
