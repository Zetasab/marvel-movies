"use client";

import { Drawer } from "@base-ui/react/drawer";
import { ImageIcon, Moon, Settings, Sun, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ponerFondoActivado, ponerTemaOscuro, useFondoActivado, useTemaOscuro } from "@/lib/preferencias";

// Botón de ajustes (a la derecha del todo de la barra) que abre un panel lateral con las preferencias.
// Todo se guarda en localStorage (ver lib/preferencias.ts y lib/legal.ts).
export function Ajustes() {
  const oscuro = useTemaOscuro();
  const fondo = useFondoActivado();

  return (
    <Drawer.Root swipeDirection="right">
      <Drawer.Trigger
        render={<Button variant="ghost" size="icon-sm" aria-label="Ajustes" title="Ajustes" className="group rounded-full hover:text-neon data-popup-open:text-neon" />}
      >
        <Settings className="transition-transform duration-500 group-hover:rotate-90 group-data-popup-open:rotate-90" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Backdrop className="fixed inset-0 z-50 min-h-dvh bg-black/40 opacity-[calc(1-var(--drawer-swipe-progress))] backdrop-blur-[2px] transition-opacity duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0 data-swiping:duration-0 dark:bg-black/60" />
        <Drawer.Viewport className="fixed inset-0 z-50 flex items-stretch justify-end">
          <Drawer.Popup className="h-full w-[min(360px,92vw)] [transform:translateX(var(--drawer-swipe-movement-x))] overflow-y-auto overscroll-contain border-l bg-background/80 shadow-2xl shadow-black/30 outline-none backdrop-blur-xl transition-transform duration-[450ms] ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:[transform:translateX(100%)] data-starting-style:[transform:translateX(100%)] data-swiping:select-none motion-reduce:duration-0">
            <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
              <Drawer.Title className="font-display text-base font-semibold">Ajustes</Drawer.Title>
              <Drawer.Close render={<Button variant="ghost" size="icon-sm" aria-label="Cerrar" />}>
                <X />
              </Drawer.Close>
            </div>

            <Drawer.Description className="px-5 pt-4 text-sm text-muted-foreground">
              Se guardan en este navegador para la próxima visita.
            </Drawer.Description>

            {/* data-base-ui-swipe-ignore: si no, el gesto de deslizar para cerrar captura el puntero al pulsar
                y el clic le llega al panel en vez de al interruptor (que es un <span>, no un botón nativo) */}
            <div data-base-ui-swipe-ignore className="grid gap-3 p-5">
              <Opcion
                id="ajuste-tema"
                // .icono-tema: el icono entra girando al cambiar (globals.css)
                icono={oscuro ? <Moon key="luna" className="icono-tema size-4" /> : <Sun key="sol" className="icono-tema size-4" />}
                titulo="Modo oscuro"
                detalle={oscuro ? "Activado" : "Tema claro"}
                activado={oscuro}
                onCambiar={ponerTemaOscuro}
              />
              <Opcion
                id="ajuste-fondo"
                icono={<ImageIcon className="size-4" />}
                titulo="Imágenes de fondo"
                detalle={fondo ? "Se cargan las fotos de cada sección" : "Desactivadas: la web carga menos datos"}
                activado={fondo}
                onCambiar={ponerFondoActivado}
              />
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Opcion({
  id,
  icono,
  titulo,
  detalle,
  activado,
  onCambiar,
}: {
  id: string;
  icono: React.ReactNode;
  titulo: string;
  detalle: string;
  activado: boolean;
  onCambiar: (activado: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-card/40 px-3 py-3 transition-colors duration-300 has-data-checked:border-neon/40">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neon/15 text-neon">{icono}</span>
      <label htmlFor={id} className="min-w-0 flex-1 cursor-pointer">
        <span className="block text-sm font-medium">{titulo}</span>
        <span className="block text-xs text-muted-foreground">{detalle}</span>
      </label>
      <Switch id={id} checked={activado} onCheckedChange={(v) => onCambiar(v)} />
    </div>
  );
}
