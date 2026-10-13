"use client";

import { Popover } from "@base-ui/react/popover";
import { ArrowUpRight, Mail, MessageCircle, X } from "lucide-react";

import { IconoGithub } from "@/components/icono-github";
import { CORREO, GITHUB_PERFIL } from "@/lib/sitio";

// Botón flotante (abajo a la derecha) para dejar una opinión o avisar de un problema
export function Contacto() {
  return (
    <Popover.Root>
      <Popover.Trigger
        aria-label="Dejar una opinión o reportar un problema"
        className="group cristal-marcado fixed right-4 bottom-4 z-40 flex size-12 cursor-pointer items-center justify-center rounded-full text-neon shadow-lg shadow-black/20 transition-[translate,scale,box-shadow] duration-300 ease-out outline-none hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-8px_var(--neon)] focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95 sm:right-6 sm:bottom-6"
      >
        {/* El icono de chat se convierte en una X al abrir */}
        <MessageCircle className="absolute size-5 transition-[rotate,scale,opacity] duration-300 group-hover:-rotate-12 group-data-popup-open:scale-50 group-data-popup-open:rotate-90 group-data-popup-open:opacity-0" />
        <X className="absolute size-5 scale-50 -rotate-90 opacity-0 transition-[rotate,scale,opacity] duration-300 group-data-popup-open:scale-100 group-data-popup-open:rotate-0 group-data-popup-open:opacity-100" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner side="top" align="end" sideOffset={12} className="z-40">
          <Popover.Popup className="w-[min(320px,calc(100vw-2rem))] origin-(--transform-origin) rounded-2xl border bg-popover/90 p-4 text-popover-foreground shadow-2xl shadow-black/30 outline-none backdrop-blur-xl transition-[scale,opacity,translate] duration-200 ease-out data-ending-style:translate-y-1 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:translate-y-1 data-starting-style:scale-95 data-starting-style:opacity-0">
            <Popover.Title className="font-display text-base leading-snug font-semibold text-balance">
              ¿Quieres dejarme una opinión o reportar algún problema?
            </Popover.Title>
            <Popover.Description className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Escríbeme un correo o búscame en GitHub. Se agradece cualquier comentario.
            </Popover.Description>

            <ul className="mt-4 grid gap-2">
              <li>
                <Opcion href={`mailto:${CORREO}?subject=${encodeURIComponent("Marvel Movies: opinión")}`} icono={<Mail className="size-4" />} titulo="Escríbeme un correo" detalle={CORREO} />
              </li>
              <li>
                <Opcion href={GITHUB_PERFIL} externo icono={<IconoGithub className="size-4" />} titulo="Mi GitHub" detalle="github.com/Zetasab" />
              </li>
            </ul>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}

function Opcion({
  href,
  externo = false,
  icono,
  titulo,
  detalle,
}: {
  href: string;
  externo?: boolean;
  icono: React.ReactNode;
  titulo: string;
  detalle: string;
}) {
  return (
    <a
      href={href}
      {...(externo && { target: "_blank", rel: "noopener noreferrer" })}
      className="group/opcion flex items-center gap-3 rounded-xl border bg-card/40 px-3 py-2.5 transition-[translate,border-color,background-color] duration-200 outline-none hover:-translate-y-px hover:border-neon/50 hover:bg-neon/5 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">{icono}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium transition-colors group-hover/opcion:text-neon">{titulo}</span>
        <span className="block truncate font-mono text-[11px] text-muted-foreground">{detalle}</span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-[translate,color] duration-200 group-hover/opcion:translate-x-0.5 group-hover/opcion:-translate-y-0.5 group-hover/opcion:text-neon" />
    </a>
  );
}
