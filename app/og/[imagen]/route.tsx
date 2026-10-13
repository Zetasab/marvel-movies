import { IMAGENES_OG, imagenOg } from "@/lib/og";

// Genera /og/<nombre>.jpg en el build (ver lib/og.tsx)
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(IMAGENES_OG).map((nombre) => ({ imagen: `${nombre}.jpg` }));
}

export async function GET(_: Request, { params }: { params: Promise<{ imagen: string }> }) {
  const { imagen } = await params;
  return imagenOg(IMAGENES_OG[imagen.replace(/\.jpg$/, "")]());
}
