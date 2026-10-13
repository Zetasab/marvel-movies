import { ArrowRight, Waypoints } from "lucide-react";
import Link from "next/link";

import { Foco } from "@/components/foco";
import { cn } from "@/lib/utils";

// Botón "¿Quiero verlas en mapa?" junto al texto de cada página de películas; `href` ya lleva los filtros del mapa
export function BotonMapa({ href, className }: { href: string; className?: string }) {
  return (
    <Foco className={cn("cristal-marcado w-fit shrink-0 rounded-full outline-offset-2 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-neon transition-[translate,box-shadow] duration-300 ease-out hover:-translate-y-0.5", className)}>
      <Link href={href} className="group flex items-center gap-2.5 py-2.5 pr-4 pl-3 text-sm font-medium whitespace-nowrap outline-none">
        <span className="flex size-7 items-center justify-center rounded-full bg-neon/15 text-neon transition-[rotate,scale] duration-500 ease-[cubic-bezier(0.34,1.4,0.64,1)] group-hover:scale-110 group-hover:-rotate-12">
          <Waypoints className="size-4" />
        </span>
        <span className="transition-colors duration-300 group-hover:text-neon">¿Quiero verlas en mapa?</span>
        <ArrowRight className="size-4 text-neon transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Foco>
  );
}
