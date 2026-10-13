# Marvel Movies

**Todas las películas de Marvel en un solo sitio: en qué orden verlas y cómo se conectan entre sí.**

Una web en español con las 110 películas basadas en Marvel Comics. Están el Universo Cinematográfico de Marvel (MCU) en orden cronológico y de estreno, el Spider-Man y el Venom de Sony, los X-Men y los Deadpool de Fox, los clásicos (Blade, el Spider-Man de Raimi…), las de animación y los telefilmes. También tiene un **mapa interactivo** que une las películas a través de sus personajes, para ver de un vistazo qué historia desemboca en cuál.

Es un proyecto personal sin ánimo de lucro: sin publicidad, sin cookies, sin analítica y sin registro. Es una web no oficial, sin relación con Marvel Entertainment, The Walt Disney Company ni Sony Pictures.

- **Código:** [github.com/Zetasab/marvel-movies](https://github.com/Zetasab/marvel-movies)
- **Autor:** [@Zetasab](https://github.com/Zetasab)
- **Opiniones o problemas:** [cesarsobrinoarribas@gmail.com](mailto:cesarsobrinoarribas@gmail.com), o el botón de chat de la propia web

---

## Índice

- [Qué tiene la web](#qué-tiene-la-web)
- [Tecnologías](#tecnologías)
- [Empezar en local](#empezar-en-local)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Los datos](#los-datos)
- [Publicar en GitHub Pages](#publicar-en-github-pages)
- [SEO: aparecer en Google](#seo-aparecer-en-google)
- [Privacidad y textos legales](#privacidad-y-textos-legales)
- [Cómo añadir o cambiar cosas](#cómo-añadir-o-cambiar-cosas)
- [Créditos y licencias](#créditos-y-licencias)

---

## Qué tiene la web

### Inicio (`/`)

Portada con las cifras del proyecto (películas, personajes, películas del MCU) y una animación de "cables". Muestra cómo Iron Man, Thor, Capitán América y Hulk desembocan en *Los Vengadores*. Desde aquí se llega a los listados y al mapa.

### Películas (`/peliculas`)

Una página índice que explica las tres formas de verlas y enlaza a cada listado:

| Ruta | Qué muestra |
|---|---|
| `/peliculas/mcu-orden-cronologico` | Las del MCU en el orden en que **transcurren** los hechos. Cada una lleva su época (1943–1945, 1995, 2010…) y su posición en la línea temporal. |
| `/peliculas/mcu-orden-de-estreno` | Las del MCU en el orden en que llegaron a los cines. |
| `/peliculas/marvel-orden-de-estreno` | **Todas** las películas basadas en Marvel, de cualquier estudio, por fecha de estreno. |

Cada listado tiene:

- **Cards.** Cada una tiene póster, títulos (español y original), etiquetas (MCU, Próximamente, Animación, TV / DVD), fecha, duración, recaudación, dirección, reparto, resumen y enlaces a Wikipedia e IMDb.
- **Buscador** por título, director o actor. No distingue tildes ni mayúsculas: "capitan" encuentra "Capitán". Hay también un botón para invertir el orden.
- **Ficha lateral.** Al pulsar una card se abre un panel a la derecha con toda la información: presupuesto, guion, productoras, géneros, reparto con sus personajes… Se pasa a la película anterior o siguiente con los botones o con las flechas del teclado. Se cierra con Escape o deslizando.
- **Botón "¿Quiero verlas en mapa?".** Abre el mapa con los filtros de ese listado ya puestos (por ejemplo, Solo MCU + Cronológico).
- **Preguntas frecuentes** (¿cuál es la primera película?, ¿cuántas hay?…). Se generan a partir de los datos, así que nunca se quedan desactualizadas.
- **Datos estructurados** (JSON-LD de `ItemList` y `Movie`) y metadatos pensados para buscadores.

### Mapa del multiverso (`/mapa`)

Un mapa interactivo con las películas colocadas en el tiempo (eje horizontal) y agrupadas por franquicia (filas: Iron Man, Thor, Vengadores, Spider-Man, X-Men…). Cada personaje es un **cable de color** que va de una película a la siguiente en la que aparece.

- **Solo MCU / Todo Marvel.** Interruptor para mostrar solo el MCU o todas las películas.
- **Estreno / Cronológico** (solo con "Solo MCU"). Ordena el mapa por fecha de estreno o por la línea temporal de la historia. En cronológico, el eje muestra épocas en vez de años.
- **Panel de personajes.** Marca y desmarca qué personajes se dibujan, con buscador y atajos (Principales, Todos, Ninguno).
- **Zoom y desplazamiento** con la rueda y arrastrando. **"Ver todo"** encuadra el mapa entero.
- **Arrastrar películas** para recolocarlas. **"Reorganizar"** las devuelve a su sitio. Cada vista (MCU por estreno, MCU cronológico, Todo Marvel) guarda sus posiciones por separado.
- **Clic en una película.** Resalta sus conexiones y abre un panel que dice de qué películas viene y en cuáles continúa cada personaje.
- Todo se recuerda en el navegador (`localStorage`) para la próxima visita.
- **Filtros por URL**, que son los que usan los botones de los listados: `/mapa?ambito=mcu&orden=cronologico`, `/mapa?ambito=todo`…

### Además

- **Tema claro y oscuro**, con el botón de la barra superior. Se recuerda y no parpadea al cargar.
- **Botón de contacto** flotante (abajo a la derecha) para dejar una opinión o reportar un problema por correo o GitHub.
- **Diseño adaptable** a móvil. Las animaciones respetan la preferencia de "reducir movimiento" del sistema.
- **Páginas legales**: aviso legal, privacidad y cookies.

---

## Tecnologías

| | |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) exportado como **web estática** |
| UI | React 19, [Tailwind CSS 4](https://tailwindcss.com), componentes de [shadcn/ui](https://ui.shadcn.com) sobre [Base UI](https://base-ui.com) |
| Mapa | SVG dibujado con React; zoom y desplazamiento con [d3-zoom](https://d3js.org/d3-zoom) |
| Iconos | [Lucide](https://lucide.dev) |
| Tipografías | Geist, Geist Mono y Unbounded (vía `next/font`) |
| Lenguaje | TypeScript |
| Datos | JSON generados desde Wikidata y Wikipedia con un script de Node sin dependencias |
| Alojamiento | GitHub Pages, con despliegue automático por GitHub Actions |

No hay base de datos ni servidor. Los datos se leen de `data/*.json` al compilar y cada página se genera como HTML estático.

---

## Empezar en local

Necesitas **Node.js 20 o superior** (el despliegue usa Node 22).

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La página se recarga sola al editar el código o los JSON de `data/`.

### Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Compila la web estática en la carpeta `out/`. |
| `npm run lint` | Revisa el código con ESLint. |
| `npm run datos` | Descarga los datos de nuevo, sin sobrescribir los JSON si ya existen (ver [Los datos](#los-datos)). |
| `npm run datos:force` | Regenera los JSON desde cero (se pierden los cambios hechos a mano). |

Para probar el resultado final tal cual se publica:

```bash
npm run build
npx serve out
```

---

## Estructura del proyecto

```
marvel-movies/
├── app/                          Rutas (App Router). Cada carpeta es una página.
│   ├── page.tsx                  Inicio
│   ├── peliculas/                Índice y los tres listados
│   ├── mapa/                     Mapa del multiverso
│   ├── aviso-legal/ privacidad/ cookies/
│   ├── layout.tsx                Estructura común: barra, pie, tema, botón de contacto, metadatos
│   ├── template.tsx              Animación de entrada en cada navegación
│   ├── robots.ts  sitemap.ts     Generados en el build
│   └── globals.css               Tema (colores, cristal, brillos, animaciones)
├── components/
│   ├── peliculas/                Cards, buscador, ficha lateral, botón al mapa, página de listado
│   ├── mapa/                     Mapa, interruptores, panel de personajes y de detalle
│   ├── inicio/                   Animación de la portada
│   ├── legal/                    Plantilla de las páginas legales
│   ├── ui/                       Componentes base (shadcn/ui)
│   └── …                         Barra, pie, contacto, tema, logo, efectos (Revelar, Foco, Aurora)
├── lib/
│   ├── datos.ts                  Lectura y tipos de los JSON de data/
│   ├── listados.ts               Definición de los tres listados (rutas, títulos, textos SEO)
│   ├── filas.ts                  Prepara las películas de cada listado para las cards
│   ├── mapa/layout.ts            Cálculo del mapa: posiciones, carriles, cables, colores, filtros por URL
│   ├── formato.ts  imagenes.ts   Fechas, cifras y miniaturas de pósters
│   ├── legal.ts                  Textos legales y lista de lo que se guarda en el navegador
│   └── sitio.ts                  URL pública, nombre, correo y enlaces de GitHub
├── data/                         Los datos (ver abajo)
├── public/                       Archivos estáticos
├── .github/workflows/deploy.yml  Despliegue en GitHub Pages
└── next.config.ts                Exportación estática y ruta base
```

---

## Los datos

Todo sale de cuatro JSON en `data/`. Se suben al repositorio porque la web los necesita para compilar.

| Archivo | Contenido | ¿Quién lo escribe? |
|---|---|---|
| `peliculas.json` | Las 110 películas: títulos, fechas, reparto con personajes, dirección, guion, géneros, estudios, presupuesto, recaudación, resumen, póster, IDs de Wikidata/IMDb/TMDB y enlaces. | El script |
| `personajes.json` | Los 215 personajes y en qué películas sale cada uno (los cables del mapa). Los marcados como `principal` salen por defecto. | El script |
| `ultima-actualizacion.json` | Fecha de la última actualización correcta, duración y totales. La fecha se muestra en el pie. | El script |
| `orden-cronologico.json` | El orden oficial en que transcurren las películas del MCU, con la época de cada una. | **A mano** (el script no lo toca) |

### Fuentes

1. **Wikipedia (en)**: [List of films based on Marvel Comics publications](https://en.wikipedia.org/wiki/List_of_films_based_on_Marvel_Comics_publications) dice qué películas existen.
2. **Wikidata**: fechas, reparto, personajes, directores, guionistas, géneros, estudios, presupuesto, recaudación e identificadores.
3. **Wikipedia (es/en)**: resumen y póster.
4. **TMDB** (opcional): sinopsis en español, pósters, nota y tráiler, si se define la variable `TMDB_API_KEY`.

### Actualizar los datos

El script `actualizar-datos.mjs` está en la carpeta `scripts/`, **al lado de este proyecto, no dentro**: `../scripts/actualizar-datos.mjs`. Se lanza así:

```bash
npm run datos           # no sobrescribe si los JSON ya existen
npm run datos:force     # los regenera desde cero
```

En Windows también vale con doble clic en `scripts/actualizar-datos.bat`. Tarda entre 5 y 20 minutos, porque Wikidata limita las peticiones.

Es seguro ejecutarlo:

- Antes de guardar, comprueba que los datos tienen sentido: un mínimo de películas y personajes, ids sin repetir y personajes que solo apuntan a películas existentes.
- Escribe cada archivo en un temporal y lo renombra al terminar.
- `ultima-actualizacion.json` se escribe lo último y solo si todo ha ido bien. Si algo falla, los datos anteriores quedan intactos.

Con TMDB (opcional; la key es gratis en [themoviedb.org](https://www.themoviedb.org/settings/api)):

```powershell
$env:TMDB_API_KEY = "tu_key"; npm run datos:force
```

Después de actualizar, haz commit de `data/` y push: la web se vuelve a publicar sola.

### Editar a mano

- **Orden cronológico.** `data/orden-cronologico.json` es una lista en orden. Cada película se identifica por su código de Wikidata (`ids.wikidata` en `peliculas.json`). El campo `titulo` solo sirve para leerlo, `epoca` es cuándo transcurre y `nota` es opcional. Para añadir o mover una película, edita la lista.
- **Cameos que sobran en el mapa.** Quita la película de la lista `peliculas` del personaje en `personajes.json`.
- **Títulos.** Vienen de Wikidata y mezclan los de España y Latinoamérica ("Vengadores: Endgame" frente a "Capitana Marvel"). Se pueden unificar a mano en `peliculas.json`.

> Ojo: `npm run datos:force` regenera `peliculas.json` y `personajes.json`, así que se pierden los cambios hechos a mano en esos dos archivos. `orden-cronologico.json` no se toca.

---

## Publicar en GitHub Pages

La web se exporta como HTML estático (`output: "export"` en `next.config.ts`). El workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) la compila y la publica en cada push a `main` o `master`.

**Solo la primera vez:**

1. Sube el proyecto a GitHub:

   ```bash
   git remote add origin https://github.com/Zetasab/marvel-movies.git
   git push -u origin master
   ```

2. En el repositorio, ve a **Settings → Pages → Build and deployment** y en **Source** elige **GitHub Actions**.
3. Lanza el workflow desde **Actions → Desplegar en GitHub Pages → Run workflow**, o haz cualquier push.

La web queda en **https://zetasab.github.io/marvel-movies/**.

No hay nada más que configurar. El workflow le pasa al build dos variables:

| Variable | Para qué | Valor en GitHub Pages |
|---|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Ruta bajo la que cuelga la web (enlaces, CSS, JS) | `/marvel-movies` |
| `NEXT_PUBLIC_SITE_URL` | URL pública (canonical, Open Graph, sitemap, JSON-LD) | `https://zetasab.github.io/marvel-movies` |

Con un dominio propio, la ruta base queda vacía sola. Para reproducir el build de producción en local, copia `.env.example` como `.env.local` y ajusta los valores.

**Lo que no se puede usar** al ser una web estática: Server Actions, rutas que lean la petición, `cookies()`, redirects, rewrites ni la optimización de imágenes de `next/image` (está desactivada con `images.unoptimized`). Por eso tampoco se usan `cacheComponents` ni `partialPrefetching`.

---

## SEO: aparecer en Google

La web está pensada para salir en búsquedas como *"orden cronológico marvel"*, *"cómo ver las películas de Marvel en orden"*, *"películas de marvel por orden de estreno"* o *"última película de marvel"*.

### Qué está hecho

| Página | Búsquedas objetivo |
|---|---|
| `/peliculas/mcu-orden-cronologico` | orden cronológico marvel, películas de marvel en orden cronológico, cómo ver marvel en orden |
| `/peliculas/mcu-orden-de-estreno` | películas de marvel por orden de estreno, orden de estreno mcu, primera película del mcu |
| `/peliculas/marvel-orden-de-estreno` | todas las películas de marvel, cuántas películas de marvel hay, películas de marvel no mcu |
| `/peliculas` | en qué orden ver las películas de marvel |
| `/mapa` | conexiones entre películas de marvel |

- **Títulos y descripciones** que empiezan por la búsqueda y llevan el año (`Orden cronológico de Marvel (2026): las 39 películas del MCU`). El año y las cifras salen de los datos, así que se renuevan solos al actualizarlos. Están en `LISTADOS` de [`lib/listados.ts`](lib/listados.ts).
- **H1 e introducción** con las mismas palabras, escritas de forma natural.
- **Todo el contenido está en el HTML** (web estática): Google ve las 110 películas sin ejecutar JavaScript.
- **Datos estructurados (JSON-LD):** `WebSite` y `Person` en el inicio, `BreadcrumbList` en todas las páginas de contenido, y en cada listado `ItemList` de `Movie` y `FAQPage`.
- **Preguntas frecuentes** al final de cada listado (¿cuál es la primera?, ¿cuántas hay?, ¿cuál es la última?…). Se generan a partir de los datos, así que la respuesta a "¿cuál es la última película de Marvel?" cambia sola con cada estreno.
- **Canonical** en cada página, **sitemap.xml** y **robots.txt**.
- **Imágenes para compartir** (Open Graph y tarjeta grande de X/Twitter), una por página, generadas en el build como PNG en `/og/*.png` ([`lib/og.tsx`](lib/og.tsx)).
- **Enlaces internos** entre los tres listados, el mapa, el menú y el pie.

### Lo que tienes que hacer tú (una vez)

Google no encuentra solo una web nueva, y menos en `github.io`. Además, en GitHub Pages el `robots.txt` no está en la raíz del dominio, así que Google no ve el sitemap por sí mismo y hay que dárselo a mano:

1. Entra en [Google Search Console](https://search.google.com/search-console) y añade una propiedad de tipo **Prefijo de la URL** con `https://zetasab.github.io/marvel-movies/`.
2. Elige el método de verificación **Etiqueta HTML**. Copia solo el valor de `content="…"`.
3. En GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**, con nombre `GOOGLE_SITE_VERIFICATION` y ese valor. Lanza de nuevo el workflow y, cuando termine, pulsa **Verificar** en Search Console.
4. En Search Console, ve a **Sitemaps** y envía `https://zetasab.github.io/marvel-movies/sitemap.xml`.
5. En **Inspección de URLs**, pega la URL de cada listado y pulsa **Solicitar indexación**.

Lo mismo se puede hacer en [Bing Webmaster Tools](https://www.bing.com/webmasters), que permite importar la propiedad directamente desde Search Console.

Para comprobar los datos estructurados de una página: [Prueba de resultados enriquecidos](https://search.google.com/test/rich-results). Y para ver cómo queda al compartirla: [opengraph.xyz](https://www.opengraph.xyz).

### Qué ayuda a subir posiciones

- **Enlaces desde otras webs** (foros, Reddit, redes, tu portafolio, el README de tu perfil de GitHub). Es lo que más pesa para competir en búsquedas tan populares.
- **Un dominio propio** (por ejemplo `ordenmarvel.com`) da más confianza que un subdirectorio de `github.io`. Con GitHub Pages se configura en **Settings → Pages → Custom domain**, y el build se adapta solo.
- **Actualizar los datos** tras cada estreno (`npm run datos:force`, commit y push): la fecha, la última película y las cifras se refrescan, y Google valora el contenido al día.

---

## Privacidad y textos legales

- **Sin cookies, sin analítica, sin publicidad.** La web no envía ningún dato a ningún servidor propio.
- Lo único que se guarda está en el `localStorage` del navegador: el tema elegido y las preferencias del mapa (ámbito, orden, personajes marcados y posiciones). La lista completa está en `ALMACENAMIENTO_LOCAL` de [`lib/legal.ts`](lib/legal.ts) y aparece sola en las páginas de privacidad y cookies. **Si añades una clave nueva, añádela ahí.**
- Los pósters se cargan desde `upload.wikimedia.org`. Los enlaces externos (Wikipedia, IMDb, GitHub) se abren en otra pestaña.
- Si cambias los textos legales, actualiza `FECHA_REVISION_LEGAL` en `lib/legal.ts`.

---

## Cómo añadir o cambiar cosas

| Quiero… | Dónde |
|---|---|
| Añadir un listado nuevo | Añade una entrada en `LISTADOS` de `lib/listados.ts` y su carpeta en `app/peliculas/`, con un `page.tsx` igual que los otros. El menú, el sitemap y los enlaces cruzados salen solos. |
| Cambiar los carriles (filas) del mapa | `FRANQUICIAS` en `lib/mapa/layout.ts`. Cada película va al primer carril cuya expresión encaje con su título original. |
| Cambiar el color de un personaje | `COLORES` en `lib/mapa/layout.ts`. Los que no aparecen ahí reciben un color generado. |
| Cambiar los colores del tema | Variables de `:root` y `.dark` en `app/globals.css` (`--neon`, `--plasma`, `--violeta`…). |
| Cambiar el correo o los enlaces de GitHub | `lib/sitio.ts`. |
| Añadir un personaje o fusionar duplicados | La constante `FUSIONES` del script de datos, y después `npm run datos:force`. |

---

## Créditos y licencias

- Datos de [Wikidata](https://www.wikidata.org) (CC0) y [Wikipedia](https://es.wikipedia.org) ([CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed.es)). Los resúmenes de Wikipedia mantienen esa licencia.
- Pósters alojados en Wikimedia Commons, propiedad de sus respectivos estudios.
- Marvel y sus personajes son marcas registradas de sus propietarios. Este proyecto no está afiliado a Marvel, Disney ni Sony.

Hecho por [@Zetasab](https://github.com/Zetasab).
