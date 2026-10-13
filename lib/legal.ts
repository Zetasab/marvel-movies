import { CLAVES_MAPA } from "@/lib/mapa/layout";
import { CLAVE_FONDO, CLAVE_TEMA } from "@/lib/tema";

// Fecha de la última revisión de los textos legales. Cámbiala si modificas aviso legal, privacidad o cookies.
export const FECHA_REVISION_LEGAL = "13 de octubre de 2026";

// Contacto que aparece en el aviso legal. Déjalo en null si no quieres publicar ninguno.
export const CONTACTO: { texto: string; href: string } | null = null;

export const PAGINAS_LEGALES = [
  { href: "/aviso-legal", texto: "Aviso legal" },
  { href: "/privacidad", texto: "Privacidad" },
  { href: "/cookies", texto: "Cookies" },
];

// Todo lo que la web guarda en el navegador del visitante. Si añades una clave nueva, añádela aquí
// y aparecerá automáticamente en las políticas de privacidad y de cookies.
export const ALMACENAMIENTO_LOCAL = [
  { clave: CLAVE_TEMA, para: "Recordar si prefieres el tema claro u oscuro." },
  { clave: CLAVE_FONDO, para: "Recordar si quieres ver las imágenes de fondo." },
  { clave: CLAVES_MAPA.ambito, para: "Recordar si el mapa muestra solo el MCU o todas las películas." },
  { clave: CLAVES_MAPA.orden, para: "Recordar si el mapa del MCU ordena las películas por estreno o por cronología." },
  { clave: CLAVES_MAPA.seleccion, para: "Recordar qué personajes has marcado en el mapa." },
  { clave: CLAVES_MAPA.posiciones, para: "Recordar dónde has colocado las películas al arrastrarlas en el mapa." },
];
