"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import fondoInicio from "@/assets/fondo.webp";
import fondoMapa from "@/assets/fondo-mapa.webp";
import fondoPeliculas from "@/assets/fondo-peliculas.webp";
import { useFondoActivado } from "@/lib/preferencias";
import { cn } from "@/lib/utils";

// Imágenes de fondo por sección: versiones reducidas en WebP (768 px, 30–90 KB) de los originales de 1920 px
// que están fuera del proyecto, en ../imagenes-originales. Desenfocadas no se nota la resolución.
const FONDOS = { inicio: fondoInicio, peliculas: fondoPeliculas, mapa: fondoMapa };
type Seccion = keyof typeof FONDOS;

function seccionDe(pathname: string): Seccion {
  if (pathname.startsWith("/peliculas")) return "peliculas";
  if (pathname.startsWith("/mapa")) return "mapa";
  return "inicio";
}

// Fondo fijo detrás de todo el contenido: la imagen de la sección muy desenfocada, un velo del color del tema
// para que el texto se lea (más opaco en claro, vía --fondo-velo) y encima las luces de colores (vía --aurora).
export function Aurora() {
  const actual = seccionDe(usePathname());
  // Se pueden desactivar en los ajustes. En el HTML estático no van (se añaden al montar), así que si están
  // desactivadas el navegador ni siquiera las descarga
  const fondoActivado = useFondoActivado();
  // Solo se descargan las imágenes de las secciones visitadas; al cambiar de sección, la nueva aparece con un fundido
  const [visitadas, setVisitadas] = useState<Seccion[]>([actual]);
  if (!visitadas.includes(actual)) setVisitadas([...visitadas, actual]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {fondoActivado && visitadas.map((s) => (
        // eslint-disable-next-line @next/next/no-img-element -- imágenes decorativas ya optimizadas; importadas para que lleven la ruta base
        <img
          key={s}
          src={FONDOS[s].src}
          alt=""
          // Decorativas: que no le quiten prioridad de carga al contenido (cuenta para el LCP de Google)
          fetchPriority="low"
          decoding="async"
          // scale-110: el desenfoque deja los bordes transparentes; así quedan fuera de la pantalla
          // starting:opacity-0: la imagen de una sección recién visitada también entra con fundido
          className={cn(
            "absolute inset-0 size-full scale-110 object-cover blur-[var(--fondo-blur)] saturate-[1.2] transition-opacity duration-700 ease-out motion-reduce:transition-none",
            s === actual ? "opacity-100 starting:opacity-0" : "opacity-0",
          )}
        />
      ))}
      <div className="absolute inset-0" style={{ background: "color-mix(in oklch, var(--background) var(--fondo-velo), transparent)" }} />
      <div className="absolute inset-0" style={{ opacity: "var(--aurora)" }}>
        <div className="aurora-luz absolute -top-[30vh] left-[8%] size-[70vh] rounded-full bg-neon/25 blur-[120px]" />
        <div className="aurora-luz absolute -top-[20vh] right-[2%] size-[60vh] rounded-full bg-violeta/25 blur-[120px] [animation-delay:-6s]" />
        <div className="aurora-luz absolute top-[45vh] left-[40%] size-[55vh] rounded-full bg-plasma/12 blur-[140px] [animation-delay:-12s]" />
      </div>
    </div>
  );
}
