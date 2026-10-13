import { IMAGENES_OG, imagenOg } from "@/lib/og";

// Genera /og/<nombre>.png en el build (ver lib/og.tsx)
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(IMAGENES_OG).map((nombre) => ({ imagen: `${nombre}.png` }));
}

export async function GET(_: Request, { params }: { params: Promise<{ imagen: string }> }) {
  const { imagen } = await params;
  const { antetitulo, titulo, pie } = IMAGENES_OG[imagen.replace(/\.png$/, "")]();
  return imagenOg({ antetitulo, titulo, pie });
}
