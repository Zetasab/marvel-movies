// Rutas que también usan componentes de cliente: este módulo no importa los datos (los JSON pesan cientos de KB)
export function rutaPersonaje(id: string) {
  return `/personajes/${id}`;
}
