"use client";

import { startTransition, useOptimistic } from "react";

import { cn } from "@/lib/utils";

type Tono = "neon" | "plasma" | "violeta";
type Opcion<T extends string> = { valor: T; texto: string; tono: Tono };

const TONOS: Record<Tono, { pildora: string; texto: string }> = {
  neon: { pildora: "border-neon/50 bg-neon/15 shadow-[0_0_16px_-4px_var(--neon)]", texto: "text-neon" },
  plasma: { pildora: "border-plasma/50 bg-plasma/15 shadow-[0_0_16px_-4px_var(--plasma)]", texto: "text-plasma" },
  violeta: { pildora: "border-violeta/50 bg-violeta/15 shadow-[0_0_16px_-4px_var(--violeta)]", texto: "text-violeta" },
};

// Interruptor de dos posiciones: una píldora se desliza (con un pequeño rebote) bajo la opción activa.
// Las dos mitades miden lo mismo para que la píldora solo tenga que moverse un 100% de su ancho.
export function Interruptor<T extends string>({
  opciones: [a, b],
  valor: real,
  onCambiar,
  etiqueta,
  className,
}: {
  opciones: [Opcion<T>, Opcion<T>];
  valor: T;
  onCambiar: (v: T) => void;
  etiqueta: string; // qué significa "activado" (la segunda opción), para lectores de pantalla
  className?: string;
}) {
  // Recalcular el mapa es pesado: la píldora se mueve en el acto (valor optimista) y el mapa cambia en una transición
  const [valor, setValor] = useOptimistic(real);
  const segunda = valor === b.valor;
  const activa = segunda ? b : a;
  const cambiar = () =>
    startTransition(() => {
      const nuevo = segunda ? a.valor : b.valor;
      setValor(nuevo);
      onCambiar(nuevo);
    });

  return (
    <button
      type="button"
      role="switch"
      aria-checked={segunda}
      aria-label={etiqueta}
      onClick={cambiar}
      className={cn(
        "group/interruptor relative grid h-7 cursor-pointer grid-cols-2 items-center rounded-full border bg-muted/50 p-0.5 font-mono text-[11px] font-medium tracking-wider uppercase outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full border transition-[translate,background-color,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] motion-reduce:duration-0",
          segunda ? "translate-x-full" : "translate-x-0",
          TONOS[activa.tono].pildora,
        )}
      />
      {[a, b].map((o) => (
        <span
          key={o.valor}
          className={cn(
            "relative px-3 text-center whitespace-nowrap transition-[color,scale] duration-300 group-active/interruptor:scale-95",
            o.valor === valor ? TONOS[o.tono].texto : "text-muted-foreground group-hover/interruptor:text-foreground",
          )}
        >
          {o.texto}
        </span>
      ))}
    </button>
  );
}
