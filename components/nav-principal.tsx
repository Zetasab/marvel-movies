"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Ajustes } from "@/components/ajustes";
import { IconoGithub } from "@/components/icono-github";
import { Logo } from "@/components/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLinkItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LISTADOS } from "@/lib/listados";
import { GITHUB_REPO } from "@/lib/sitio";
import { cn } from "@/lib/utils";

const ESTILO_ENLACE =
  "rounded-full px-2 py-1.5 text-sm sm:px-3.5 text-muted-foreground transition-all duration-200 ease-out outline-none hover:-translate-y-px hover:bg-foreground/[0.05] hover:text-foreground active:scale-95 focus-visible:ring-2 focus-visible:ring-neon";
const ESTILO_ACTIVO =
  "bg-foreground/[0.07] text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--neon)_40%,transparent),0_0_20px_-6px_var(--neon)]";

// Altura total de la barra (h-16): la usan el mapa y la barra de filtros de películas
export function NavPrincipal() {
  const pathname = usePathname();
  const enPeliculas = pathname === "/peliculas" || pathname.startsWith("/peliculas/");
  const enMapa = pathname === "/mapa";
  const enPersonajes = pathname === "/personajes" || pathname.startsWith("/personajes/");

  return (
    <header className="sticky top-0 z-30 h-16 shrink-0 px-2 pt-3 sm:px-3">
      <div className="cristal entrada mx-auto flex h-11 max-w-5xl items-center gap-2 rounded-full pr-1 pl-2.5 shadow-lg sm:pr-1.5 sm:pl-3 shadow-black/5">
        <Link href="/" className="group mr-1 flex shrink-0 items-center gap-2 rounded-full sm:mr-3">
          <Logo className="size-6 transition-transform duration-500 group-hover:rotate-90" />
          <span className="hidden font-display text-[12px] font-semibold tracking-wider uppercase sm:inline">Marvel Movies</span>
        </Link>

        <nav aria-label="Principal" className="flex items-center gap-0.5 sm:gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger className={cn(ESTILO_ENLACE, "flex items-center gap-1 data-popup-open:text-foreground", enPeliculas && ESTILO_ACTIVO)}>
              Películas
              <ChevronDown className="size-3.5 transition-transform in-data-popup-open:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} className="w-72 rounded-xl border bg-popover/95 p-1.5 shadow-xl backdrop-blur-xl">
              {LISTADOS.map((l) => (
                <DropdownMenuLinkItem
                  key={l.ruta}
                  render={<Link href={l.ruta} />}
                  className={cn(
                    "rounded-lg px-3 py-2 transition-[translate,color] duration-200 data-highlighted:translate-x-1 data-highlighted:text-neon",
                    pathname === l.ruta && "text-neon",
                  )}
                >
                  {l.menu}
                </DropdownMenuLinkItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLinkItem render={<Link href="/peliculas" />} className="rounded-lg px-3 py-2 text-muted-foreground transition-[translate,color] duration-200 data-highlighted:translate-x-1 data-highlighted:text-neon">
                ¿En qué orden verlas?
              </DropdownMenuLinkItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/personajes" aria-current={pathname === "/personajes" ? "page" : undefined} className={cn(ESTILO_ENLACE, enPersonajes && ESTILO_ACTIVO)}>
            Personajes
          </Link>

          <Link href="/mapa" aria-current={enMapa ? "page" : undefined} className={cn(ESTILO_ENLACE, enMapa && ESTILO_ACTIVO)}>
            Mapa
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-0.5">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Código del proyecto en GitHub"
            title="Código en GitHub"
            className="group hidden size-7 items-center sm:flex justify-center rounded-full text-muted-foreground transition-[color,background-color,scale] duration-200 outline-none hover:bg-foreground/[0.05] hover:text-foreground focus-visible:ring-2 focus-visible:ring-neon active:scale-95"
          >
            <IconoGithub className="size-4 transition-transform duration-300 group-hover:-rotate-12" />
          </a>
          {/* El tema claro/oscuro está dentro de los ajustes */}
          <Ajustes />
        </div>
      </div>
    </header>
  );
}
