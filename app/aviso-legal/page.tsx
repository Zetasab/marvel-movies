import type { Metadata } from "next";
import Link from "next/link";

import { PaginaLegal } from "@/components/legal/pagina-legal";
import { CONTACTO } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Aviso legal",
  description:
    "Proyecto personal sin ánimo de lucro y no oficial sobre las películas de Marvel. Condiciones de uso, fuentes de datos y propiedad intelectual.",
  alternates: { canonical: "/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <PaginaLegal
      titulo="Aviso legal"
      ruta="/aviso-legal"
      resumen="Proyecto personal de un programador, sin ánimo de lucro: sin publicidad, sin pagos y sin recogida de datos. No es una web oficial y no tiene relación con Marvel, Disney ni Sony."
    >
      <h2>Naturaleza de la web</h2>
      <p>
        Esta web es un <strong>proyecto personal y gratuito</strong>, creado por un programador con fines de aprendizaje,
        experimentación y divulgación para aficionados al cine. No tiene ánimo de lucro: no muestra publicidad, no vende
        productos ni servicios, no cobra por ningún contenido y no recibe ingresos de ningún tipo.
      </p>
      {CONTACTO && (
        <p>
          Contacto: <a href={CONTACTO.href}>{CONTACTO.texto}</a>
        </p>
      )}

      <h2>Web no oficial</h2>
      <p>
        Esta web <strong>no está afiliada, patrocinada ni respaldada</strong> por Marvel Entertainment, Marvel Studios, The Walt
        Disney Company, Sony Pictures, 20th Century Studios ni ninguna otra empresa mencionada. Marvel, los nombres de sus
        personajes y los títulos de las películas son marcas registradas de sus respectivos propietarios, y se usan aquí
        únicamente para identificar las obras de las que se habla.
      </p>

      <h2>Fuentes de los datos</h2>
      <ul>
        <li>
          <strong>Wikidata</strong>: fechas, reparto, personajes, dirección y otros datos, bajo licencia{" "}
          <a href="https://creativecommons.org/publicdomain/zero/1.0/deed.es" target="_blank" rel="noopener noreferrer">
            CC0
          </a>
          .
        </li>
        <li>
          <strong>Wikipedia</strong>: la lista de películas y los resúmenes, bajo licencia{" "}
          <a href="https://creativecommons.org/licenses/by-sa/4.0/deed.es" target="_blank" rel="noopener noreferrer">
            Creative Commons Atribución-CompartirIgual 4.0
          </a>
          . Los resúmenes se muestran tal como aparecen en Wikipedia y cada película enlaza a su artículo original.
        </li>
        <li>
          <strong>Pósters</strong>: pertenecen a sus respectivos estudios y titulares de derechos. Se muestran a tamaño
          reducido, desde los servidores de Wikimedia, solo para identificar cada película.
        </li>
        <li>
          <strong>Orden cronológico del MCU</strong>: elaborado a partir del orden oficial publicado por Marvel.
        </li>
      </ul>
      <p>
        Si eres titular de algún contenido y prefieres que no aparezca aquí, se retirará sin problema
        {CONTACTO ? (
          <>
            {" "}
            escribiendo a <a href={CONTACTO.href}>{CONTACTO.texto}</a>.
          </>
        ) : (
          "."
        )}
      </p>

      <h2>Exactitud de la información</h2>
      <p>
        Los datos se obtienen automáticamente de fuentes abiertas y se ofrecen <strong>tal cual</strong>, a modo informativo.
        Pueden contener errores, estar incompletos o desactualizados (por ejemplo, fechas de películas aún no estrenadas). El
        autor no se responsabiliza de las decisiones tomadas a partir de esta información.
      </p>

      <h2>Enlaces externos</h2>
      <p>
        La web enlaza a sitios de terceros como Wikipedia o IMDb. El autor no controla su contenido ni se hace responsable de
        él.
      </p>

      <h2>Privacidad y cookies</h2>
      <p>
        Esta web no recoge datos personales ni usa cookies. Consulta la <Link href="/privacidad">política de privacidad</Link> y
        la <Link href="/cookies">política de cookies</Link>.
      </p>

      <h2>Código</h2>
      <p>
        El código de la web es obra del autor. Las bibliotecas de terceros que utiliza (Next.js, React, shadcn/ui, Tailwind CSS,
        d3, entre otras) se rigen por sus propias licencias de código abierto.
      </p>
    </PaginaLegal>
  );
}
