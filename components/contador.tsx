"use client";

import { useEffect, useRef } from "react";

// Número que cuenta desde 0 hasta su valor cuando aparece en pantalla.
// El HTML del servidor ya trae el valor final (bueno para SEO y si no hay JavaScript);
// la animación solo cambia el texto en el navegador.
export function Contador({ valor, duracion = 1100 }: { valor: number; duracion?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const observador = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return;
      observador.disconnect();
      const inicio = performance.now();
      const paso = (ahora: number) => {
        const t = Math.min((ahora - inicio) / duracion, 1);
        const suavizado = 1 - Math.pow(1 - t, 3); // ease-out
        el.textContent = String(Math.round(valor * suavizado));
        if (t < 1) frame = requestAnimationFrame(paso);
      };
      frame = requestAnimationFrame(paso);
    });
    observador.observe(el);
    return () => {
      observador.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [valor, duracion]);

  return (
    <span ref={ref} className="tabular-nums">
      {valor}
    </span>
  );
}
