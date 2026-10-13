// Fecha legible en español. Se formatea en el servidor con zona horaria fija para que no dependa del navegador.
export function formatearFecha(iso: string) {
  return new Intl.DateTimeFormat("es-ES", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Madrid" }).format(new Date(iso));
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Fecha de estreno ("AAAA-MM-DD", "AAAA-MM" o null) -> "2 de mayo de 2008" / "mayo de 2008" / "2008".
// Sin Date para que no influya la zona horaria.
export function formatearEstreno(fecha: string | null, anio: number) {
  if (!fecha) return String(anio);
  const [a, m, d] = fecha.split("-").map(Number);
  const mes = MESES[m - 1];
  return d ? `${d} de ${mes} de ${a}` : `${mes} de ${a}`;
}

// 585174222 -> "585 M$", 2799439100 -> "2.799 M$"
export function formatearDolares(cantidad: number | null) {
  if (cantidad === null) return null;
  return `${Math.round(cantidad / 1e6).toLocaleString("es-ES", { useGrouping: "always" })} M$`;
}
