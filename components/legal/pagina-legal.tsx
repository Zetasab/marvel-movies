import Link from "next/link";

import { ALMACENAMIENTO_LOCAL, FECHA_REVISION_LEGAL, PAGINAS_LEGALES } from "@/lib/legal";
import { cn } from "@/lib/utils";

// Estructura común de las páginas legales: título, fecha de revisión, texto y enlaces a las otras
export function PaginaLegal({ titulo, resumen, ruta, children }: { titulo: string; resumen: string; ruta: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-12 pb-20">
      <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Legal</p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{titulo}</h1>
      <p className="mt-2 font-mono text-xs text-muted-foreground">Última revisión: {FECHA_REVISION_LEGAL}</p>

      {/* Resumen en una frase, destacado */}
      <p className="cristal-marcado entrada mt-8 rounded-2xl p-5 leading-relaxed" style={{ ["--retraso" as string]: "150ms" }}>
        {resumen}
      </p>

      <div
        className={cn(
          "mt-10 space-y-4 leading-relaxed text-muted-foreground",
          "[&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-foreground",
          "[&_strong]:font-medium [&_strong]:text-foreground",
          "[&_a]:text-neon [&_a]:underline [&_a]:decoration-neon/40 [&_a]:underline-offset-4 [&_a]:transition-[text-decoration-color] [&_a:hover]:decoration-neon",
          "[&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5",
        )}
      >
        {children}
      </div>

      <nav aria-label="Otras páginas legales" className="mt-14 flex flex-wrap gap-2 border-t pt-6">
        {PAGINAS_LEGALES.filter((p) => p.href !== ruta).map((p) => (
          <Link key={p.href} href={p.href} className="cristal rounded-full px-4 py-1.5 text-sm transition-[color,translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-neon hover:shadow-[0_0_20px_-6px_var(--neon)] active:scale-95">
            {p.texto}
          </Link>
        ))}
      </nav>
    </main>
  );
}

// Tabla de lo que se guarda en el navegador (sale de lib/legal.ts, así no se desactualiza)
export function TablaAlmacenamiento() {
  return (
    <div className="cristal overflow-x-auto rounded-xl">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b">
            <th className="px-4 py-3 font-mono text-[11px] font-medium tracking-wider uppercase">Clave</th>
            <th className="px-4 py-3 font-mono text-[11px] font-medium tracking-wider uppercase">Para qué sirve</th>
            <th className="px-4 py-3 font-mono text-[11px] font-medium tracking-wider uppercase">Duración</th>
          </tr>
        </thead>
        <tbody>
          {ALMACENAMIENTO_LOCAL.map((a) => (
            <tr key={a.clave} className="border-b transition-colors last:border-0 hover:bg-foreground/[0.04]">
              <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-foreground">{a.clave}</td>
              <td className="px-4 py-3">{a.para}</td>
              <td className="px-4 py-3 whitespace-nowrap">Hasta que la borres</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
