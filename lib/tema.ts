export const CLAVE_TEMA = "tema";
// "no" si el visitante desactivó las imágenes de fondo en los ajustes (lib/preferencias.ts)
export const CLAVE_FONDO = "fondo";

// Se ejecuta en <head> antes de pintar la página: aplica el tema guardado sin parpadeo.
// Por defecto oscuro (el <html> ya trae la clase "dark"); solo se quita si el usuario eligió el claro.
// También marca <html> con la clase "js": las animaciones de aparición solo ocultan contenido si hay JavaScript.
export const SCRIPT_TEMA = `(function(){document.documentElement.classList.add("js");try{if(localStorage.getItem("${CLAVE_TEMA}")==="claro")document.documentElement.classList.remove("dark")}catch(e){}})()`;
