"use client";

import { select } from "d3-selection";
import "d3-transition";
import {
  zoom as crearZoom,
  zoomIdentity,
  zoomTransform,
  type ZoomBehavior,
} from "d3-zoom";
import { Maximize2, RotateCcw } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import { Button } from "@/components/ui/button";
import {
  CARRIL_H,
  CLAVES_MAPA,
  POSTER_H,
  TARJETA_H,
  TARJETA_W,
  calcularLayout,
  enAmbito,
  partirTitulo,
  puntosCable,
  vistaDe,
  type Ambito,
  type Orden,
  type PeliculaMapa,
  type PersonajeMapa,
  type Posiciones,
} from "@/lib/mapa/layout";
import { miniatura } from "@/lib/imagenes";
import { cn } from "@/lib/utils";

import { Interruptor } from "./interruptor";
import { PanelDetalle, type Conexion } from "./panel-detalle";
import { PanelPersonajes, type ModoSeleccion } from "./panel-personajes";

type Foco = { pelicula: string } | { personaje: string } | null;

type Arrastre = {
  id: string;
  inicioX: number;
  inicioY: number;
  x0: number;
  y0: number;
  k: number;
  movido: boolean;
};

const CLAVES = CLAVES_MAPA;

// localStorage puede no estar disponible (modo privado, etc.)
function leer<T>(clave: string): T | null {
  try {
    const v = localStorage.getItem(clave);
    return v === null ? null : (JSON.parse(v) as T);
  } catch {
    return null;
  }
}
function guardar(clave: string, valor: unknown) {
  try {
    localStorage.setItem(clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

export function MapaRelaciones({
  peliculas,
  personajes,
  ultimaActualizacion,
}: {
  peliculas: PeliculaMapa[];
  personajes: PersonajeMapa[];
  ultimaActualizacion: string | null;
}) {
  const principales = useMemo(
    () => new Set(personajes.filter((c) => c.principal).map((c) => c.id)),
    [personajes],
  );

  const [ambito, setAmbito] = useState<Ambito>("mcu");
  const [orden, setOrden] = useState<Orden>("estreno"); // solo cuenta en "Solo MCU"
  const [seleccion, setSeleccion] = useState<Set<string>>(principales);
  const [posiciones, setPosiciones] = useState<Posiciones>({});
  const [cargado, setCargado] = useState(false);
  const [fijado, setFijado] = useState<string | null>(null);
  const [hover, setHover] = useState<Foco>(null);
  const [arrastre, setArrastre] = useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    texto: string;
    color: string;
    nombre: string;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const zoomRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const arrastreRef = useRef<Arrastre | null>(null);

  // Preferencias guardadas (después de montar, para no descuadrar la hidratación).
  // Los filtros de la URL (?ambito=…&orden=…, p. ej. desde un listado de películas) mandan sobre los guardados.
  const filtrosUrl = useRef<URLSearchParams | null>(null);
  useEffect(() => {
    // En una ref: en desarrollo el efecto se ejecuta dos veces y la segunda ya no tendría los parámetros
    filtrosUrl.current ??= new URLSearchParams(window.location.search);
    const url = filtrosUrl.current;
    const a = url.get("ambito") ?? leer<Ambito>(CLAVES.ambito);
    const o = url.get("orden") ?? leer<Orden>(CLAVES.orden);
    // Se quitan de la URL ya aplicados: a partir de aquí los interruptores son los que mandan
    if (url.has("ambito") || url.has("orden")) history.replaceState(history.state, "", window.location.pathname);
    const s = leer<string[]>(CLAVES.seleccion);
    const p = leer<Posiciones>(CLAVES.posiciones);
    if (a === "mcu" || a === "todo") setAmbito(a);
    if (o === "estreno" || o === "cronologico") setOrden(o);
    if (s) setSeleccion(new Set(s));
    if (p) setPosiciones(p);
    setCargado(true);
  }, []);
  useEffect(() => {
    if (!cargado) return;
    guardar(CLAVES.ambito, ambito);
    guardar(CLAVES.orden, orden);
    guardar(CLAVES.seleccion, [...seleccion]);
    guardar(CLAVES.posiciones, posiciones);
  }, [cargado, ambito, orden, seleccion, posiciones]);

  const vista = vistaDe(ambito, orden);
  const layout = useMemo(
    () => calcularLayout(peliculas, personajes, vista, seleccion, posiciones),
    [peliculas, personajes, vista, seleccion, posiciones],
  );
  const layoutRef = useRef(layout);
  useEffect(() => {
    layoutRef.current = layout;
  }, [layout]);

  const posicion = (id: string) =>
    arrastre?.id === id ? arrastre : layout.porId.get(id)!;

  // ---------- zoom y encuadre ----------

  useEffect(() => {
    const svg = select(svgRef.current!);
    const zoom = crearZoom<SVGSVGElement, unknown>()
      .scaleExtent([0.08, 2.5])
      // Sobre una película solo se hace zoom con la rueda; arrastrar la mueve a ella, no al lienzo
      .filter((e: Event) => {
        const sobrePeli = (e.target as Element).closest?.("[data-peli]");
        if (sobrePeli) return e.type === "wheel";
        return (
          (!(e as MouseEvent).ctrlKey || e.type === "wheel") &&
          !(e as MouseEvent).button
        );
      })
      .on("zoom", (e) =>
        gRef.current?.setAttribute("transform", e.transform.toString()),
      );
    svg.call(zoom).on("dblclick.zoom", null);
    zoomRef.current = zoom;
    return () => {
      svg.on(".zoom", null);
    };
  }, []);

  const encuadrar = useCallback((animar = true) => {
    const svg = svgRef.current;
    const zoom = zoomRef.current;
    if (!svg || !zoom) return false;
    const { width, height } = svg.getBoundingClientRect();
    const { ancho, alto } = layoutRef.current;
    if (!width || !height) return false;
    const caja = { x: 0, y: -30, w: ancho, h: alto + 30 };
    const k = Math.min(width / (caja.w + 80), height / (caja.h + 80), 1);
    const t = zoomIdentity
      .translate(
        width / 2 - (caja.x + caja.w / 2) * k,
        height / 2 - (caja.y + caja.h / 2) * k,
      )
      .scale(k);
    if (animar) select(svg).transition().duration(600).call(zoom.transform, t);
    else select(svg).call(zoom.transform, t);
    return true;
  }, []);

  // Encuadre inicial en cuanto el lienzo tiene tamaño
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      if (encuadrar(false)) ro.disconnect();
    });
    ro.observe(svgRef.current!);
    return () => ro.disconnect();
  }, [encuadrar]);

  const centrarEn = (id: string) => {
    const nodo = layout.porId.get(id);
    const svg = svgRef.current;
    if (!nodo || !svg || !zoomRef.current) return;
    const { width, height } = svg.getBoundingClientRect();
    const k = Math.max(zoomTransform(svg).k, 0.6);
    const t = zoomIdentity
      .translate(
        width / 2 - (nodo.x + TARJETA_W / 2) * k,
        height / 2 - (nodo.y + TARJETA_H / 2) * k,
      )
      .scale(k);
    select(svg).transition().duration(600).call(zoomRef.current.transform, t);
    setFijado(id);
  };

  // ---------- arrastrar películas ----------

  const alPulsar = (e: ReactPointerEvent, id: string) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const nodo = layout.porId.get(id)!;
    arrastreRef.current = {
      id,
      inicioX: e.clientX,
      inicioY: e.clientY,
      x0: nodo.x,
      y0: nodo.y,
      k: zoomTransform(svgRef.current!).k,
      movido: false,
    };
  };
  const alMover = (e: ReactPointerEvent) => {
    const a = arrastreRef.current;
    if (!a) return;
    const dx = e.clientX - a.inicioX;
    const dy = e.clientY - a.inicioY;
    if (!a.movido && Math.hypot(dx, dy) < 4) return;
    a.movido = true;
    setArrastre({ id: a.id, x: a.x0 + dx / a.k, y: a.y0 + dy / a.k });
  };
  const alSoltar = () => {
    const a = arrastreRef.current;
    arrastreRef.current = null;
    if (!a) return;
    if (!a.movido) {
      setFijado((f) => (f === a.id ? null : a.id));
      return;
    }
    if (arrastre)
      setPosiciones((p) => ({
        ...p,
        [`${vista}:${a.id}`]: {
          x: Math.round(arrastre.x),
          y: Math.round(arrastre.y),
        },
      }));
    setArrastre(null);
  };

  // ---------- foco ----------

  const activos = useMemo(() => {
    const foco: Foco = hover ?? (fijado ? { pelicula: fijado } : null);
    if (!foco) return null;
    const cables = new Set<string>();
    const pelis = new Set<string>("pelicula" in foco ? [foco.pelicula] : []);
    for (const c of layout.cables) {
      const activo =
        "pelicula" in foco
          ? c.origen === foco.pelicula || c.destino === foco.pelicula
          : c.personaje.id === foco.personaje;
      if (activo) {
        cables.add(c.id);
        pelis.add(c.origen);
        pelis.add(c.destino);
      }
    }
    return { cables, pelis };
  }, [hover, fijado, layout.cables]);

  // ---------- paneles ----------

  const cuentas = useMemo(() => {
    const porId = new Map(peliculas.map((p) => [p.id, p]));
    return new Map(
      personajes.map((c) => [
        c.id,
        c.peliculas.filter(
          (id) => porId.has(id) && enAmbito(porId.get(id)!, ambito),
        ).length,
      ]),
    );
  }, [peliculas, personajes, ambito]);

  const seleccionar = (modo: ModoSeleccion) => {
    setSeleccion(
      new Set(
        modo === "todos"
          ? personajes.map((c) => c.id)
          : modo === "principales"
            ? principales
            : [],
      ),
    );
  };
  const alternar = (id: string, marcado: boolean) => {
    setSeleccion((s) => {
      const nueva = new Set(s);
      if (marcado) nueva.add(id);
      else nueva.delete(id);
      return nueva;
    });
  };

  const peliFijada = fijado ? layout.porId.get(fijado) : undefined;
  const conexiones = (clave: "origen" | "destino"): Conexion[] => {
    if (!peliFijada) return [];
    const otra = clave === "origen" ? "destino" : "origen";
    const grupos = new Map<string, Conexion>();
    for (const c of layout.cables) {
      if (c[otra] !== peliFijada.id) continue;
      const id = c[clave];
      if (!grupos.has(id))
        grupos.set(id, { pelicula: layout.porId.get(id)!, personajes: [] });
      grupos.get(id)!.personajes.push(c.personaje);
    }
    return [...grupos.values()];
  };

  const cambiarAmbito = (nuevo: Ambito) => {
    setAmbito(nuevo);
    if (
      fijado &&
      !enAmbito(peliculas.find((p) => p.id === fijado) ?? { mcu: false }, nuevo)
    )
      setFijado(null);
    requestAnimationFrame(() => encuadrar());
  };

  const cambiarOrden = (nuevo: Orden) => {
    setOrden(nuevo);
    requestAnimationFrame(() => encuadrar());
  };

  const reorganizar = () => {
    setPosiciones((p) =>
      Object.fromEntries(
        Object.entries(p).filter(([k]) => !k.startsWith(`${vista}:`)),
      ),
    );
    requestAnimationFrame(() => encuadrar());
  };

  return (
    // Ocupa la pantalla menos la barra de navegación (h-16)
    <div className="flex h-[calc(100dvh-4rem)] flex-col text-foreground">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-2.5">
        <div className="flex items-baseline gap-3">
          <h1 className="font-display text-sm font-semibold tracking-wide uppercase">
            Mapa del multiverso Marvel
          </h1>
          {ultimaActualizacion && (
            <span className="hidden font-mono text-[11px] text-muted-foreground lg:inline">
              Datos del {ultimaActualizacion}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Interruptor
            opciones={[
              { valor: "mcu", texto: "Solo MCU", tono: "neon" },
              { valor: "todo", texto: "Todo Marvel", tono: "plasma" },
            ]}
            valor={ambito}
            onCambiar={cambiarAmbito}
            etiqueta="Mostrar todas las películas de Marvel, no solo las del MCU"
          />
          {/* El orden cronológico solo existe para el MCU (la línea temporal oficial) */}
          {ambito === "mcu" && (
            <Interruptor
              opciones={[
                { valor: "estreno", texto: "Estreno", tono: "neon" },
                { valor: "cronologico", texto: "Cronológico", tono: "violeta" },
              ]}
              valor={orden}
              onCambiar={cambiarOrden}
              etiqueta="Ordenar las películas según la línea temporal de la historia, no por estreno"
              className="animate-in duration-300 fade-in slide-in-from-left-2 zoom-in-95"
            />
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={reorganizar}
            title="Volver a colocar las películas en su sitio"
          >
            <RotateCcw /> Reorganizar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => encuadrar()}
            title="Ajustar el zoom para verlo todo"
          >
            <Maximize2 /> Ver todo
          </Button>
        </div>
      </header>

      <div className="relative flex min-h-0 flex-1">
        <PanelPersonajes
          personajes={personajes}
          seleccion={seleccion}
          cuentas={cuentas}
          onSeleccionar={seleccionar}
          onAlternar={alternar}
          onHover={(id) =>
            setHover(id && seleccion.has(id) ? { personaje: id } : null)
          }
        />

        <section
          className="fondo-rejilla relative min-w-0 flex-1"
          onPointerMove={alMover}
          onPointerUp={alSoltar}
        >
          <svg
            ref={svgRef}
            className="block size-full cursor-grab touch-none select-none active:cursor-grabbing"
            onClick={(e) => e.target === svgRef.current && setFijado(null)}
          >
            <defs>
              <clipPath id="recorte-poster">
                <rect width={TARJETA_W} height={POSTER_H} rx={6} />
              </clipPath>
            </defs>
            <g ref={gRef}>
              {/* Carriles (franquicias) */}
              {layout.carriles.map((c, i) => (
                <g key={c.id} transform={`translate(0,${c.y})`}>
                  <rect
                    width={layout.ancho}
                    height={CARRIL_H}
                    className={
                      i % 2 ? "fill-foreground/[0.03]" : "fill-transparent"
                    }
                  />
                  <text
                    x={20}
                    y={CARRIL_H / 2}
                    dominantBaseline="middle"
                    className="fill-muted-foreground font-display text-[13px] font-semibold tracking-wider uppercase"
                  >
                    {c.nombre}
                  </text>
                </g>
              ))}

              {/* Eje de años (o de épocas en orden cronológico) */}
              {layout.marcasEje.map(({ etiqueta, x }) => (
                <g key={`${etiqueta}-${x}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={-10}
                    y2={layout.alto}
                    className="stroke-foreground/[0.06]"
                  />
                  <text
                    x={x + 4}
                    y={-16}
                    className="fill-muted-foreground font-mono text-xs tabular-nums"
                  >
                    {etiqueta}
                  </text>
                </g>
              ))}

              {/* Cables */}
              {layout.cables.map((c, i) => {
                const { d, x1, y1, x2, y2 } = puntosCable(
                  c,
                  posicion(c.origen),
                  posicion(c.destino),
                );
                const activo = !activos || activos.cables.has(c.id);
                // Al montarse (al cargar o al cambiar de ámbito) cada cable se dibuja, escalonados
                const retraso = {
                  ["--retraso" as string]: `${Math.min(i * 5, 900)}ms`,
                };
                return (
                  <g
                    key={c.id}
                    className={cn(
                      "transition-opacity",
                      activo ? "opacity-100" : "opacity-10",
                    )}
                  >
                    <path
                      d={d}
                      pathLength={1}
                      fill="none"
                      stroke={c.personaje.color}
                      strokeWidth={activos && activo ? 3.5 : 2.5}
                      strokeLinecap="round"
                      opacity={0.85}
                      className="cable-dibujar transition-[stroke-width] duration-300"
                      // Resplandor de neón solo en los cables resaltados (y solo en oscuro, vía --glow)
                      style={{
                        ...retraso,
                        ...(activos && activo
                          ? {
                              filter: `drop-shadow(0 0 calc(var(--glow) * 6px) ${c.personaje.color})`,
                            }
                          : {}),
                      }}
                    />
                    <circle
                      cx={x1}
                      cy={y1}
                      r={3.5}
                      fill={c.personaje.color}
                      className="surgir"
                      style={retraso}
                    />
                    <circle
                      cx={x2}
                      cy={y2}
                      r={3.5}
                      fill={c.personaje.color}
                      className="surgir"
                      style={retraso}
                    />
                    <path
                      d={d}
                      fill="none"
                      stroke="transparent"
                      strokeWidth={12}
                      className="cursor-pointer"
                      onMouseEnter={(e) => {
                        setHover({ personaje: c.personaje.id });
                        mostrarTooltip(
                          e,
                          c.personaje,
                          `${layout.porId.get(c.origen)!.titulo} → ${layout.porId.get(c.destino)!.titulo}`,
                        );
                      }}
                      onMouseMove={(e) =>
                        mostrarTooltip(
                          e,
                          c.personaje,
                          `${layout.porId.get(c.origen)!.titulo} → ${layout.porId.get(c.destino)!.titulo}`,
                        )
                      }
                      onMouseLeave={() => {
                        setHover(null);
                        setTooltip(null);
                      }}
                    />
                  </g>
                );
              })}

              {/* Películas */}
              {layout.nodos.map((n, i) => {
                const { x, y } = posicion(n.id);
                const activa = !activos || activos.pelis.has(n.id);
                const poster = miniatura(n.poster);
                return (
                  <g
                    key={n.id}
                    data-peli
                    transform={`translate(${x},${y})`}
                    className={cn(
                      "group cursor-pointer transition-opacity",
                      activa ? "opacity-100" : "opacity-15",
                    )}
                    onPointerDown={(e) => alPulsar(e, n.id)}
                    onMouseEnter={() =>
                      !fijado && !arrastre && setHover({ pelicula: n.id })
                    }
                    onMouseLeave={() => !fijado && setHover(null)}
                  >
                    {/* Surge al cargar y crece un poco al pasar el ratón */}
                    <g
                      className="surgir"
                      style={{
                        ["--retraso" as string]: `${Math.min(i * 12, 600)}ms`,
                      }}
                    >
                      <g className="origin-center transition-transform duration-300 ease-out [transform-box:fill-box] group-hover:scale-[1.06]">
                        <rect
                          width={TARJETA_W}
                          height={POSTER_H}
                          rx={8}
                          className="fill-muted"
                        />
                        {poster ? (
                          <image
                            href={poster}
                            width={TARJETA_W}
                            height={POSTER_H}
                            preserveAspectRatio="xMidYMid slice"
                            clipPath="url(#recorte-poster)"
                          />
                        ) : (
                          <text
                            x={TARJETA_W / 2}
                            y={POSTER_H / 2}
                            textAnchor="middle"
                            className="fill-muted-foreground text-[11px]"
                          >
                            sin póster
                          </text>
                        )}
                        <rect
                          width={TARJETA_W}
                          height={POSTER_H}
                          rx={8}
                          fill="none"
                          className={cn(
                            "stroke-border transition-[stroke] group-hover:stroke-neon",
                            fijado === n.id && "stroke-neon",
                          )}
                          strokeWidth={fijado === n.id ? 2 : 1}
                          style={
                            fijado === n.id
                              ? {
                                  filter:
                                    "drop-shadow(0 0 calc(var(--glow) * 8px) var(--neon))",
                                }
                              : undefined
                          }
                        />
                      </g>
                    </g>
                    <text
                      y={-6}
                      className="fill-muted-foreground font-mono text-[11px]"
                    >
                      {n.anio}
                    </text>
                    {n.proximamente && (
                      <text
                        x={TARJETA_W}
                        y={-6}
                        textAnchor="end"
                        className="fill-plasma font-mono text-[10px] font-semibold tracking-wider"
                      >
                        PRÓXIMAMENTE
                      </text>
                    )}
                    <text
                      y={POSTER_H + 16}
                      className="fill-foreground text-xs font-semibold"
                    >
                      {partirTitulo(n.titulo).map((linea, i) => (
                        <tspan key={i} x={0} dy={i ? 14 : 0}>
                          {linea}
                        </tspan>
                      ))}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {tooltip && (
            <div
              className="pointer-events-none absolute z-10 animate-in rounded-lg border bg-popover/90 px-2.5 py-1.5 text-xs whitespace-nowrap text-popover-foreground shadow-lg backdrop-blur duration-150 fade-in zoom-in-95"
              style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
            >
              <b style={{ color: tooltip.color }}>{tooltip.nombre}</b>:{" "}
              {tooltip.texto}
            </div>
          )}

          <p className="pointer-events-none absolute bottom-3 left-1/2 hidden -translate-x-1/2 rounded-full border bg-background/80 px-3 py-1 font-mono text-[11px] whitespace-nowrap text-muted-foreground backdrop-blur md:block">
            Arrastra las películas para moverlas · Rueda para zoom · Clic en una
            película para ver sus conexiones
          </p>
        </section>

        {peliFijada && (
          <PanelDetalle
            pelicula={peliFijada}
            personajes={personajes.filter((c) =>
              c.peliculas.includes(peliFijada.id),
            )}
            seleccion={seleccion}
            vieneDe={conexiones("origen")}
            continuaEn={conexiones("destino")}
            onCerrar={() => setFijado(null)}
            onIr={centrarEn}
          />
        )}
      </div>
    </div>
  );

  function mostrarTooltip(
    e: React.MouseEvent,
    personaje: PersonajeMapa,
    texto: string,
  ) {
    const caja = svgRef.current!.getBoundingClientRect();
    setTooltip({
      x: e.clientX - caja.left,
      y: e.clientY - caja.top,
      texto,
      color: personaje.color,
      nombre: personaje.nombre,
    });
  }
}
