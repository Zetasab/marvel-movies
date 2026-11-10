import { getSeriesFilas } from "@/lib/filas";

// Genera /datos/series.json en el build: las series que el listado de películas carga al marcar «Incluir series»
export const dynamic = "force-static";

export function GET() {
  return Response.json(getSeriesFilas());
}
