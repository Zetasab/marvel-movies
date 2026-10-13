import type { Metadata } from "next";
import Link from "next/link";

import { PaginaLegal, TablaAlmacenamiento } from "@/components/legal/pagina-legal";
import { openGraphDe } from "@/lib/og";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Esta web no recoge datos personales: sin formularios, sin cuentas, sin analítica y sin publicidad.",
  alternates: { canonical: "/privacidad" },
  openGraph: openGraphDe({ ruta: "/privacidad", imagen: "inicio" }),
};

export default function PrivacidadPage() {
  return (
    <PaginaLegal
      titulo="Política de privacidad"
      ruta="/privacidad"
      resumen="Esta web no recoge, no guarda y no comparte ningún dato personal. Solo recuerda tus preferencias de visualización en tu propio navegador, y esa información nunca sale de tu dispositivo."
    >
      <h2>Quién está detrás</h2>
      <p>
        Esta web es un proyecto personal de un programador, sin ánimo de lucro y con fines de aprendizaje y divulgación. No vende
        nada, no muestra publicidad y no cobra por nada. Más detalles en el <Link href="/aviso-legal">aviso legal</Link>.
      </p>

      <h2>Qué datos se recogen</h2>
      <p>
        <strong>Ninguno.</strong> No hay formularios, registro, cuentas de usuario, comentarios ni boletines. No se usan
        herramientas de analítica (como Google Analytics), píxeles de seguimiento, publicidad ni perfiles de usuario. Por eso
        no hay ninguna base de datos con información sobre ti.
      </p>

      <h2>Qué se guarda en tu navegador</h2>
      <p>
        Para que la web recuerde tus preferencias entre visitas se usa el <strong>almacenamiento local</strong> (localStorage) de
        tu navegador. Esta información se guarda solo en tu dispositivo, la web no la envía a ningún servidor y no sirve para
        identificarte:
      </p>
      <TablaAlmacenamiento />
      <p>
        Puedes borrarla cuando quieras desde la configuración de tu navegador (borrar datos de sitios web). La web seguirá
        funcionando igual; solo olvidará tus preferencias. Más información en la <Link href="/cookies">política de cookies</Link>.
      </p>

      <h2>Servicios de terceros</h2>
      <ul>
        <li>
          <strong>Imágenes de Wikimedia.</strong> Los pósters se cargan desde los servidores de Wikimedia (Wikipedia). Al
          mostrarlos, tu navegador se conecta a ellos y, como ocurre con cualquier web, reciben datos técnicos como tu dirección
          IP. Consulta la{" "}
          <a href="https://foundation.wikimedia.org/wiki/Policy:Privacy_policy/es" target="_blank" rel="noopener noreferrer">
            política de privacidad de Wikimedia
          </a>
          .
        </li>
        <li>
          <strong>Alojamiento.</strong> El servidor donde está alojada la web puede registrar datos técnicos de las visitas
          (dirección IP, fecha, página solicitada, navegador) en sus registros de acceso, por seguridad y funcionamiento. El
          autor no usa esos registros para identificar a nadie ni con ningún otro fin.
        </li>
        <li>
          <strong>Enlaces externos.</strong> Los enlaces a Wikipedia, IMDb u otras webs te llevan a sitios con sus propias
          políticas de privacidad.
        </li>
        <li>
          <strong>Tipografías.</strong> Las fuentes se sirven desde esta misma web, sin conexiones a Google Fonts.
        </li>
      </ul>

      <h2>Tus derechos</h2>
      <p>
        Como no se tratan datos personales, no hay datos que consultar, corregir o eliminar. Aun así, el Reglamento General de
        Protección de Datos (RGPD) te reconoce los derechos de acceso, rectificación, supresión, oposición, limitación y
        portabilidad, y puedes presentar una reclamación ante la{" "}
        <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
          Agencia Española de Protección de Datos
        </a>{" "}
        si lo consideras necesario.
      </p>

      <h2>Cambios</h2>
      <p>
        Si la web incorporase algún día algo que recogiera datos (por ejemplo, estadísticas de visitas), esta política se
        actualizaría antes y, si fuese necesario, se pediría tu consentimiento.
      </p>
    </PaginaLegal>
  );
}
