import { PaginaListado, metadatosListado } from "@/components/peliculas/pagina-listado";
import { LISTADOS } from "@/lib/listados";

const listado = LISTADOS.find((l) => l.ruta === "/peliculas/mcu-orden-de-estreno")!;

export const metadata = metadatosListado(listado);

export default function Page() {
  return <PaginaListado listado={listado} />;
}
