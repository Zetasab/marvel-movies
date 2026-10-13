"use client";

import { useEffect, useRef, type ComponentProps } from "react";

// Hace aparecer su contenido (sube y se desvanece) cuando entra en pantalla al hacer scroll.
// `retraso` en ms permite escalonar varios elementos seguidos.
export function Revelar({ retraso = 0, style, ...props }: ComponentProps<"div"> & { retraso?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (!entrada.isIntersecting) return;
        el.setAttribute("data-visible", "");
        observador.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observador.observe(el);
    return () => observador.disconnect();
  }, []);

  return <div ref={ref} data-revelar="" style={{ ...style, ["--retraso" as string]: `${retraso}ms` }} {...props} />;
}
