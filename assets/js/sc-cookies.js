/* ==========================================================================
   Studio Complex · Aviso de cookies
   --------------------------------------------------------------------------
   Muestra la barra de abajo una sola vez. Cuando la persona toca "Entendido"
   se guarda esa marca en el navegador y no vuelve a aparecer.

   Lo único que se guarda es que el aviso ya se cerró. No hay analítica ni
   pixeles en el sitio: si mañana se suman, este archivo es el lugar donde
   enganchar el consentimiento antes de que carguen.

   No usa requestAnimationFrame: en algunos navegadores del equipo no llega a
   dispararse y el aviso quedaba invisible. Se fuerza un reflow, igual que en
   sc-modal.js.
   ========================================================================== */

(function () {
  "use strict";

  var CLAVE = "sc-cookies-ok";

  function iniciar() {
    var aviso = document.getElementById("sc-cookies");
    if (!aviso) return;

    var yaCerrado = false;
    try {
      yaCerrado = window.localStorage.getItem(CLAVE) === "1";
    } catch (e) {
      // Navegación privada con almacenamiento bloqueado: se muestra igual.
      yaCerrado = false;
    }
    if (yaCerrado) return;

    aviso.hidden = false;
    document.body.classList.add("sc-cookies-visible");
    void aviso.offsetHeight; // fuerza el reflow para que la transición corra
    aviso.classList.add("is-visible");

    var boton = aviso.querySelector(".sc-cookies-ok");
    if (!boton) return;

    boton.addEventListener("click", function () {
      aviso.classList.remove("is-visible");
      document.body.classList.remove("sc-cookies-visible");
      try {
        window.localStorage.setItem(CLAVE, "1");
      } catch (e) {
        // Si no se puede guardar, el aviso vuelve en la próxima visita.
      }
      window.setTimeout(function () {
        aviso.hidden = true;
      }, 350);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
