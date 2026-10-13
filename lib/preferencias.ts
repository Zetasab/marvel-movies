"use client";

import { useSyncExternalStore } from "react";

import { CLAVE_FONDO, CLAVE_TEMA } from "@/lib/tema";

// Preferencias del visitante (panel de ajustes), guardadas en localStorage.
// Se leen con useSyncExternalStore: en el servidor y al hidratar valen lo de por defecto, y en cuanto
// el cliente monta pasan al valor real sin desajustes de hidratación.

const EVENTO = "preferencias-cambiadas";

function guardar(clave: string, valor: string) {
  try {
    localStorage.setItem(clave, valor);
  } catch {
    /* sin almacenamiento: el cambio dura hasta recargar */
  }
}

// ---------- tema ----------
// La fuente de verdad es la clase "dark" de <html> (la pone el script de lib/tema.ts antes de pintar)

function suscribirTema(avisar: () => void) {
  const observador = new MutationObserver(avisar);
  observador.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observador.disconnect();
}

export function useTemaOscuro() {
  return useSyncExternalStore(suscribirTema, () => document.documentElement.classList.contains("dark"), () => true);
}

export function ponerTemaOscuro(oscuro: boolean) {
  const html = document.documentElement;
  // Durante medio segundo todos los colores cambian con transición, en vez de saltar de golpe
  html.classList.add("cambiando-tema");
  window.setTimeout(() => html.classList.remove("cambiando-tema"), 500);
  html.classList.toggle("dark", oscuro);
  guardar(CLAVE_TEMA, oscuro ? "oscuro" : "claro");
}

// ---------- imágenes de fondo ----------

function suscribirFondo(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar); // cambios hechos en otra pestaña
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

function leerFondo() {
  try {
    return localStorage.getItem(CLAVE_FONDO) !== "no";
  } catch {
    return true;
  }
}

// En el servidor `false`: el HTML estático no lleva las imágenes, así no se descargan si el visitante las desactivó
export function useFondoActivado() {
  return useSyncExternalStore(suscribirFondo, leerFondo, () => false);
}

export function ponerFondoActivado(activado: boolean) {
  guardar(CLAVE_FONDO, activado ? "si" : "no");
  window.dispatchEvent(new Event(EVENTO));
}
