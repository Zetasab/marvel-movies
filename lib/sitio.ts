// URL pública de la web (para canonical, Open Graph, sitemap y JSON-LD).
// En producción define NEXT_PUBLIC_SITE_URL, p. ej. NEXT_PUBLIC_SITE_URL=https://tudominio.com
export const URL_SITIO = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export const NOMBRE_SITIO = "Marvel Movies";

// Código de verificación de Google Search Console (método "etiqueta HTML"): solo el valor de content="…".
// En GitHub Pages se pasa desde la variable del repositorio GOOGLE_SITE_VERIFICATION (ver README).
export const VERIFICACION_GOOGLE = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined;

// JSON-LD como texto seguro para meterlo en un <script> (ver guía JSON-LD de Next)
export function jsonLd(datos: unknown) {
  return JSON.stringify(datos).replace(/</g, "\\u003c");
}

// Contacto y código del proyecto (botón flotante de opinión, barra superior y pie)
export const CORREO = "cesarsobrinoarribas@gmail.com";
export const GITHUB_PERFIL = "https://github.com/Zetasab";
export const GITHUB_REPO = "https://github.com/Zetasab/marvel-movies";
