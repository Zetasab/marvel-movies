import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Unbounded } from "next/font/google";

import { Aurora } from "@/components/aurora";
import { Contacto } from "@/components/contacto";
import { NavPrincipal } from "@/components/nav-principal";
import { Pie } from "@/components/pie";
import { ScriptTema } from "@/components/script-tema";
import { metadatosImagenOg } from "@/lib/og";
import { GITHUB_PERFIL, NOMBRE_SITIO, URL_SITIO, VERIFICACION_GOOGLE } from "@/lib/sitio";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

// Solo para títulos: ancha y técnica
const unbounded = Unbounded({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(URL_SITIO),
  title: { default: "Películas de Marvel en orden cronológico y de estreno | Marvel Movies", template: `%s · ${NOMBRE_SITIO}` },
  description:
    "Todas las películas de Marvel en orden: el MCU en orden cronológico y de estreno, las de Sony y Fox, y un mapa de cómo se conectan a través de sus personajes.",
  applicationName: NOMBRE_SITIO,
  authors: [{ name: "Zetasab", url: GITHUB_PERFIL }],
  alternates: { canonical: "/" },
  // Base para las páginas sin openGraph propio (p. ej. la 404). Las demás usan openGraphDe() de lib/og.tsx
  openGraph: { siteName: NOMBRE_SITIO, locale: "es_ES", type: "website", images: metadatosImagenOg("inicio") },
  // Tarjeta grande al compartir (usa las imágenes opengraph-image de cada ruta)
  twitter: { card: "summary_large_image" },
  // Que Google pueda mostrar fragmentos e imágenes grandes (Discover, resultados con imagen)
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  ...(VERIFICACION_GOOGLE && { verification: { google: VERIFICACION_GOOGLE } }),
};

// Color de la barra del navegador en el móvil (el fondo oscuro de la web)
export const viewport: Viewport = { themeColor: "#0d101a" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: el script de tema puede quitar la clase "dark" (tema claro) antes de que React hidrate
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${unbounded.variable} dark h-full antialiased`} suppressHydrationWarning>
      <head>
        <ScriptTema />
      </head>
      <body className="flex min-h-full flex-col">
        <Aurora />
        <NavPrincipal />
        {children}
        <Pie />
        <Contacto />
      </body>
    </html>
  );
}
