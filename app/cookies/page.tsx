import type { Metadata } from "next";
import Link from "next/link";

import { PaginaLegal, TablaAlmacenamiento } from "@/components/legal/pagina-legal";
import { openGraphDe } from "@/lib/og";

export const metadata: Metadata = {
  title: "Política de cookies",
  description: "Esta web no usa cookies. Solo guarda tus preferencias de visualización en el almacenamiento local de tu navegador.",
  alternates: { canonical: "/cookies" },
  openGraph: openGraphDe({ ruta: "/cookies", imagen: "inicio" }),
};

export default function CookiesPage() {
  return (
    <PaginaLegal
      titulo="Política de cookies"
      ruta="/cookies"
      resumen="Esta web no usa cookies: ni propias ni de terceros, ni de análisis ni de publicidad. Por eso no verás ningún aviso de cookies."
    >
      <h2>¿Qué son las cookies?</h2>
      <p>
        Son pequeños archivos que algunas webs guardan en tu navegador y que se envían de vuelta al servidor en cada visita.
        Suelen usarse para mantener sesiones, medir visitas o mostrar publicidad personalizada. Esta web no hace nada de eso.
      </p>

      <h2>Lo que sí se usa: almacenamiento local</h2>
      <p>
        La web guarda algunas preferencias en el <strong>almacenamiento local</strong> (localStorage) de tu navegador. A
        diferencia de las cookies, esta información <strong>no se envía nunca al servidor</strong>: se queda en tu dispositivo
        y solo la lee la propia página para recordar tus elecciones.
      </p>
      <TablaAlmacenamiento />
      <p>
        Se trata de almacenamiento estrictamente necesario para ofrecer algo que tú mismo pides (por ejemplo, cambiar al tema
        claro), por lo que, según el artículo 22.2 de la Ley de Servicios de la Sociedad de la Información (LSSI), no requiere
        consentimiento previo.
      </p>

      <h2>Cómo borrarlo</h2>
      <p>
        En cualquier navegador puedes borrar los datos de este sitio desde su configuración, normalmente en «Privacidad» →
        «Borrar datos de navegación» o «Datos de sitios web». Al borrarlos, la web volverá a su configuración por defecto.
      </p>

      <h2>Contenido de terceros</h2>
      <p>
        Los pósters se cargan desde los servidores de Wikimedia. Esta web no les pide que guarden cookies, aunque esos servidores
        se rigen por su propia política. Tienes más detalles en la <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </PaginaLegal>
  );
}
