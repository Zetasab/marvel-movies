"use client";

import { SCRIPT_TEMA } from "@/lib/tema";

// Script inline que aplica el tema guardado antes de pintar (ver guía "Preventing Flash" de Next).
// Es Client Component para que el type cambie entre servidor y cliente: en el servidor se ejecuta y en el
// cliente React lo deja como texto, así no avisa de "script tag while rendering React component".
export function ScriptTema() {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT_TEMA }}
    />
  );
}
