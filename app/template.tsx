// A diferencia del layout, el template se vuelve a montar en cada navegación:
// así cada página entra con una pequeña animación (ver .entrada en globals.css)
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="entrada flex flex-1 flex-col">{children}</div>;
}
