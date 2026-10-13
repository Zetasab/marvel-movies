// Marca: el anillo del reactor arc, en neón. El núcleo late despacio, como si estuviera encendido.
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--neon)" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" fill="var(--plasma)" className="respirar" />
      <circle cx="12" cy="12" r="9" fill="none" stroke="var(--neon)" strokeWidth="6" style={{ opacity: "calc(var(--glow) * 0.18)" }} />
    </svg>
  );
}
