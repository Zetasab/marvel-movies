"use client";

import type { ComponentProps, MouseEvent } from "react";

import { cn } from "@/lib/utils";

// Guarda la posición del ratón en --mx/--my para que .foco-raton dibuje el brillo que lo sigue
export function moverFoco(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

export function Foco({ className, ...props }: ComponentProps<"div">) {
  return <div onMouseMove={moverFoco} className={cn("foco-raton", className)} {...props} />;
}
