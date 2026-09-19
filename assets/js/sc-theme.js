/* Interruptor de tema claro / oscuro.

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

  document.querySelectorAll(".sc-theme-toggle").forEach(function (boton) {
    boton.setAttribute("aria-pressed", tema === "light" ? "true" : "false");
    boton.title = tema === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro";

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
  });
})();
