"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "cn";

// Interruptor on/off (Base UI): pista que se llena de neón y bolita que se desliza con un pequeño rebote
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border bg-muted p-0.5 transition-[background-color,border-color,box-shadow] duration-300 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 data-checked:border-neon/60 data-checked:bg-neon/25 data-checked:shadow-[0_0_14px_-4px_var(--neon)]",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="size-[18px] rounded-full bg-muted-foreground shadow-sm transition-[translate,background-color] duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)] data-checked:translate-x-5 data-checked:bg-neon motion-reduce:duration-0" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
