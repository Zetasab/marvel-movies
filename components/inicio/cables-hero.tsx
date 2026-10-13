// Ilustración del inicio: cuatro películas en solitario enchufadas con cables de neón a The Avengers.
// Es la misma idea que el mapa, en pequeño. Al cargar: los pósters surgen uno tras otro, los cables se dibujan
// y después empieza a circular la corriente. Todo se desactiva con prefers-reduced-motion.

export type PosterHero = {
  titulo: string;
  poster: string | null;
  color: string;
};

const W = 560;
const H = 440;
const ORIGEN = { x: 24, w: 66, h: 99, sep: 108, y0: 10 };
const DESTINO = { x: 400, y: 128, w: 132, h: 198 };

export function CablesHero({
  origenes,
  destino,
}: {
  origenes: PosterHero[];
  destino: PosterHero;
}) {
  const yDestino = DESTINO.y + DESTINO.h / 2;
  const cables = origenes.map((o, i) => {
    const y1 = ORIGEN.y0 + i * ORIGEN.sep + ORIGEN.h / 2;
    const x1 = ORIGEN.x + ORIGEN.w;
    const y2 = yDestino + (i - (origenes.length - 1) / 2) * 12;
    const x2 = DESTINO.x;
    const dx = (x2 - x1) * 0.5;
    return {
      d: `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`,
      x1,
      y1,
      x2,
      y2,
      color: o.color,
    };
  });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={`${origenes.map((o) => o.titulo).join(", ")} conectan con ${destino.titulo}`}
    >
      <defs>
        <filter id="hero-brillo" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <clipPath id="hero-recorte-o">
          <rect width={ORIGEN.w} height={ORIGEN.h} rx={8} />
        </clipPath>
        <clipPath id="hero-recorte-d">
          <rect width={DESTINO.w} height={DESTINO.h} rx={12} />
        </clipPath>
      </defs>

      {cables.map((c, i) => {
        const retraso = { ["--retraso" as string]: `${400 + i * 120}ms` };
        return (
          <g key={i}>
            {/* Resplandor (solo en oscuro), cable base que se dibuja y corriente que aparece después */}
            <path
              d={c.d}
              pathLength={1}
              fill="none"
              stroke={c.color}
              strokeWidth={8}
              filter="url(#hero-brillo)"
              className="cable-dibujar"
              style={{ ...retraso, opacity: "calc(var(--glow) * 0.55)" }}
            />
            <path
              d={c.d}
              pathLength={1}
              fill="none"
              stroke={c.color}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0.45}
              className="cable-dibujar"
              style={retraso}
            />
            <g
              className="entrada"
              style={{ ["--retraso" as string]: `${1300 + i * 120}ms` }}
            >
              <path
                d={c.d}
                fill="none"
                stroke={c.color}
                strokeWidth={2.5}
                strokeLinecap="round"
                className="cable-corriente"
                style={{ animationDelay: `${i * -1.3}s` }}
              />
            </g>
            <circle
              cx={c.x1}
              cy={c.y1}
              r={4}
              fill={c.color}
              className="surgir"
              style={retraso}
            />
            <circle
              cx={c.x2}
              cy={c.y2}
              r={4}
              fill={c.color}
              className="surgir"
              style={{ ["--retraso" as string]: `${1200 + i * 120}ms` }}
            />
          </g>
        );
      })}

      {origenes.map((o, i) => (
        <g
          key={o.titulo}
          transform={`translate(${ORIGEN.x},${ORIGEN.y0 + i * ORIGEN.sep})`}
        >
          <g
            className="surgir"
            style={{ ["--retraso" as string]: `${150 + i * 90}ms` }}
          >
            <g className="origin-center transition-transform duration-300 ease-out [transform-box:fill-box] hover:scale-110">
              <Poster
                poster={o.poster}
                w={ORIGEN.w}
                h={ORIGEN.h}
                rx={8}
                clip="hero-recorte-o"
              />
            </g>
          </g>
        </g>
      ))}

      <g transform={`translate(${DESTINO.x},${DESTINO.y})`}>
        <g className="surgir" style={{ ["--retraso" as string]: "650ms" }}>
          <g className="flotar">
            <rect
              x={-6}
              y={-6}
              width={DESTINO.w + 12}
              height={DESTINO.h + 12}
              rx={16}
              fill="none"
              stroke="var(--neon)"
              strokeWidth={1.5}
              opacity={0.6}
            />
            <rect
              x={-6}
              y={-6}
              width={DESTINO.w + 12}
              height={DESTINO.h + 12}
              rx={16}
              fill="none"
              stroke="var(--neon)"
              strokeWidth={8}
              filter="url(#hero-brillo)"
              style={{ opacity: "calc(var(--glow) * 0.5)" }}
            />
            <Poster
              poster={destino.poster}
              w={DESTINO.w}
              h={DESTINO.h}
              rx={12}
              clip="hero-recorte-d"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

function Poster({
  poster,
  w,
  h,
  rx,
  clip,
}: {
  poster: string | null;
  w: number;
  h: number;
  rx: number;
  clip: string;
}) {
  return (
    <>
      <rect width={w} height={h} rx={rx} className="fill-muted" />
      {poster && (
        <image
          href={poster}
          width={w}
          height={h}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clip})`}
        />
      )}
      <rect
        width={w}
        height={h}
        rx={rx}
        fill="none"
        className="stroke-border"
      />
    </>
  );
}
