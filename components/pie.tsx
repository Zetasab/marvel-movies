import Link from "next/link";

import { IconoGithub } from "@/components/icono-github";
import { Logo } from "@/components/logo";
import { Revelar } from "@/components/revelar";
import { getUltimaActualizacion } from "@/lib/datos";
import { formatearFecha } from "@/lib/formato";
import { PAGINAS_LEGALES } from "@/lib/legal";
import { LISTADOS } from "@/lib/listados";
import { CORREO, GITHUB_PERFIL, GITHUB_REPO } from "@/lib/sitio";

export function Pie() {
  const actualizacion = getUltimaActualizacion();

  return (
    <footer className="mt-auto border-t">
      <Revelar className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Link href="/" className="group inline-flex items-center gap-2">
            <Logo className="size-5 transition-transform duration-500 group-hover:rotate-90" />
            <span className="font-display text-[12px] font-semibold tracking-wider uppercase">Marvel Movies</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Proyecto personal de un programador, sin ánimo de lucro: sin publicidad, sin pagos y sin recogida de datos. Web no
            oficial, sin relación con Marvel Entertainment, The Walt Disney Company ni Sony Pictures.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <a
              href={GITHUB_REPO}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition-[border-color,color,translate] duration-200 hover:-translate-y-px hover:border-neon/50 hover:text-neon"
            >
              <IconoGithub className="size-4 transition-transform duration-300 group-hover:-rotate-12" />
              Código en GitHub
            </a>
            <a href={GITHUB_PERFIL} target="_blank" rel="noopener noreferrer" className="enlace-linea text-muted-foreground hover:text-neon">
              @Zetasab
            </a>
            <a href={`mailto:${CORREO}`} className="enlace-linea text-muted-foreground hover:text-neon">
              Contacto
            </a>
          </div>
        </div>

        <nav aria-label="Películas">
          <h2 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Películas</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {LISTADOS.map((l) => (
              <li key={l.ruta}>
                <Link href={l.ruta} className="inline-block text-muted-foreground transition-[color,translate] duration-200 hover:translate-x-1 hover:text-neon">
                  {l.menu}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/mapa" className="inline-block text-muted-foreground transition-[color,translate] duration-200 hover:translate-x-1 hover:text-neon">
                Mapa del multiverso
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="font-mono text-[11px] tracking-wider text-muted-foreground uppercase">Legal</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {PAGINAS_LEGALES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="inline-block text-muted-foreground transition-[color,translate] duration-200 hover:translate-x-1 hover:text-neon">
                  {p.texto}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Sin cookies. Sin analítica. Sin publicidad.</p>
        </nav>
      </Revelar>

      <div className="border-t">
        <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-x-6 gap-y-2 px-4 py-5 font-mono text-[11px] text-muted-foreground">
          <p>
            Datos de{" "}
            <a href="https://www.wikidata.org" target="_blank" rel="noopener noreferrer" className="enlace-linea hover:text-foreground">
              Wikidata
            </a>{" "}
            (CC0) y{" "}
            <a href="https://es.wikipedia.org" target="_blank" rel="noopener noreferrer" className="enlace-linea hover:text-foreground">
              Wikipedia
            </a>{" "}
            (
            <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noopener noreferrer" className="enlace-linea hover:text-foreground">
              CC BY-SA 4.0
            </a>
            ) · <span className="punto-vivo relative mr-1 inline-block size-1.5 rounded-full bg-neon align-middle" aria-hidden />
            actualizados el {formatearFecha(actualizacion.fecha)}
          </p>
          <p>Marvel y sus personajes son marcas registradas de sus propietarios.</p>
        </div>
      </div>
    </footer>
  );
}
