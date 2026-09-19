/* Interruptor de tema claro / oscuro.

   Vive flotando arriba del asistente, no en el header: ahi quedaba en el
   medio de la barra en mobile, entre el logo y el menu.

   El sitio nace oscuro a proposito: el claro es una opcion, no el default.
   La eleccion se recuerda en el navegador de cada visitante.

   Por que recarga la pagina en vez de cambiar el tema en caliente:
   la plantilla Tekmino son 15.000 lineas de CSS con "transition: all" en
   cientos de selectores, un halo con blur a pantalla completa y GSAP
   escuchando el layout. Cambiar las ~340 variables de color de golpe obliga
   a recalcular el estilo de toda la pagina, y eso se midio en ~9,5 segundos
   por recalculo (la pagina queda congelada mientras tanto). Recargar cuesta
   una fraccion de eso y el tema ya viene aplicado desde el primer frame,
   porque el <head> lee localStorage antes de pintar. */
(function () {
  "use strict";

  var CLAVE = "sc-theme";

  function actual() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "light"
      : "dark";
  }

  var tema = actual();

  var boton = document.createElement("button");
  boton.type = "button";
  boton.className = "sc-theme-toggle";
  boton.setAttribute("aria-label", "Cambiar entre tema claro y oscuro");
  boton.setAttribute("aria-pressed", tema === "light" ? "true" : "false");
  boton.title = tema === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";
  boton.innerHTML = [
    '<svg class="sc-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">',
    '  <circle cx="12" cy="12" r="4"/>',
    '  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    "</svg>",
    '<svg class="sc-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
    '  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    "</svg>",
  ].join("\n");

  boton.addEventListener("click", function () {
    var nuevo = actual() === "light" ? "dark" : "light";
    try {
      localStorage.setItem(CLAVE, nuevo);
    } catch (e) {
      /* Navegacion privada: no se puede guardar, asi que se aplica a mano
         y vale solo para esta pagina. */
      document.documentElement.setAttribute("data-theme", nuevo);
      return;
    }
    location.reload();
  });

  document.body.appendChild(boton);
})();
