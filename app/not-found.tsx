import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Next añade <meta name="robots" content="noindex"> por su cuenta en esta página
export const metadata: Metadata = {
  title: "Página no encontrada",
  description: "Esta página no existe en esta línea temporal. Vuelve al inicio o sigue por las películas, el mapa o los personajes.",
};

const ATAJOS = [
  { href: "/peliculas", texto: "Películas" },
  { href: "/mapa", texto: "Mapa del multiverso" },
  { href: "/personajes", texto: "Personajes" },
];

export default function NoEncontrada() {
  return (
    <main className="flex-1">
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
        <div>
          <p className="entrada font-mono text-xs tracking-widest text-muted-foreground uppercase">
            Error 404 · Rama temporal desconocida
          </p>
          <h1
            style={{ ["--retraso" as string]: "80ms" }}
            className="entrada mt-5 font-display text-4xl leading-[1.05] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            Esta página no existe en esta <span className="texto-degradado">línea temporal</span>.
          </h1>
          <p
            style={{ ["--retraso" as string]: "180ms" }}
            className="entrada mt-6 max-w-md text-lg leading-relaxed text-pretty text-muted-foreground"
          >
            El enlace está roto o la página se ha quedado en otro universo. Vuelve al inicio o sigue por
            cualquiera de estos caminos.
          </p>
          <div style={{ ["--retraso" as string]: "260ms" }} className="entrada mt-8 flex flex-wrap gap-3">
            <Link href="/" className={cn(buttonVariants({ size: "lg" }), "boton-glow group h-10 rounded-full px-5")}>
              <ArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" /> Volver al inicio
            </Link>
          </div>
          <nav
            aria-label="Secciones de la web"
            style={{ ["--retraso" as string]: "340ms" }}
            className="entrada mt-10 flex flex-wrap gap-2 border-t pt-6"
          >
            {ATAJOS.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                className="group cristal inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm transition-[color,translate,box-shadow] duration-200 hover:-translate-y-0.5 hover:text-neon hover:shadow-[0_0_20px_-6px_var(--neon)] active:scale-95"
              >
                {a.texto}
                <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="relative">
          {/* Halo detrás del cable cortado, como en el inicio */}
          <div
            aria-hidden
            className="absolute top-1/2 left-1/2 -z-10 size-[60%] -translate-x-1/2 -translate-y-1/2"
            style={{ opacity: "calc(var(--glow) * 0.4)" }}
          >
            <div className="degradado-marca respirar size-full rounded-full blur-[90px]" />
          </div>
          <CableCortado />
        </div>
      </section>
    </main>
  );
}

// La misma idea que los cables del inicio y del mapa, pero sin destino: tres cables llegan y se cortan
// antes del 404. Se dibujan, empieza a circular la corriente y en los extremos saltan chispas.
const CABLES = [
  { color: "var(--neon)", y: 70, corte: 232 },
  { color: "var(--violeta)", y: 160, corte: 214 },
  { color: "var(--plasma)", y: 250, corte: 226 },
];
const Y_CENTRO = 160;

function CableCortado() {
  return (
    <svg viewBox="0 0 560 320" className="h-auto w-full" role="img" aria-label="Tres cables de neón cortados antes de llegar a un 404">
      <defs>
        <filter id="nf-brillo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {CABLES.map((c, i) => {
        const y2 = Y_CENTRO + (i - 1) * 14;
        const dx = (c.corte - 24) * 0.5;
        const d = `M24,${c.y} C${24 + dx},${c.y} ${c.corte - dx},${y2} ${c.corte},${y2}`;
        const retraso = { ["--retraso" as string]: `${300 + i * 120}ms` };
        return (
          <g key={i}>
            <path d={d} pathLength={1} fill="none" stroke={c.color} strokeWidth={8} filter="url(#nf-brillo)" className="cable-dibujar" style={{ ...retraso, opacity: "calc(var(--glow) * 0.55)" }} />
            <path d={d} pathLength={1} fill="none" stroke={c.color} strokeWidth={2} strokeLinecap="round" opacity={0.45} className="cable-dibujar" style={retraso} />
            <g className="entrada" style={{ ["--retraso" as string]: `${1200 + i * 120}ms` }}>
              <path d={d} fill="none" stroke={c.color} strokeWidth={2.5} strokeLinecap="round" className="cable-corriente" style={{ animationDelay: `${i * -1.3}s` }} />
            </g>
            <circle cx={24} cy={c.y} r={4} fill={c.color} className="surgir" style={retraso} />
            {/* Chispas en el extremo cortado */}
            <g className="surgir" style={{ ["--retraso" as string]: `${1300 + i * 120}ms` }}>
              <g className="respirar" style={{ animationDelay: `${i * -0.9}s` }}>
                {[-40, 0, 40].map((a) => (
                  <line
                    key={a}
                    x1={c.corte + 7}
                    y1={y2}
                    x2={c.corte + 17}
                    y2={y2}
                    stroke={c.color}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    transform={`rotate(${a} ${c.corte} ${y2})`}
                  />
                ))}
              </g>
            </g>
          </g>
        );
      })}

      <g className="surgir" style={{ ["--retraso" as string]: "650ms" }}>
        <g className="flotar">
          <text
            x={410}
            y={Y_CENTRO}
            textAnchor="middle"
            dominantBaseline="central"
            className="font-display"
            fontSize={104}
            fontWeight={600}
            letterSpacing={-4}
            fill="url(#nf-degradado)"
          >
            404
          </text>
          <text x={410} y={Y_CENTRO + 76} textAnchor="middle" className="fill-muted-foreground font-mono" fontSize={12} letterSpacing={3}>
            SIN CONEXIÓN
          </text>
        </g>
      </g>
      <defs>
        <linearGradient id="nf-degradado" x1="0" y1="0" x2="1" y2="0.4">
          <stop offset="0" stopColor="var(--neon)" />
          <stop offset="0.55" stopColor="var(--violeta)" />
          <stop offset="1" stopColor="var(--plasma)" />
        </linearGradient>
      </defs>
    </svg>
  );
}
