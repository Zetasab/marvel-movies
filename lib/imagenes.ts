// Los pósters de Wikipedia vienen a tamaño original (pesan mucho); pedimos una miniatura de 330 px
export function miniatura(url: string | null): string | null {
  const m = url?.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/[^/]+)\/(\w\/\w\w)\/([^/?]+)/);
  if (!m || /\.svg$/i.test(m[3])) return url?.split("?")[0] ?? null;
  return `${m[1]}/thumb/${m[2]}/${m[3]}/330px-${m[3]}`;
}
