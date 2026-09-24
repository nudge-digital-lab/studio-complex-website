/* ==========================================================================
   Studio Complex · Caso de éxito
   --------------------------------------------------------------------------
   Tres cosas, todas atadas al scroll:

   1. Revelar los bloques cuando entran en pantalla.
   2. Encender los pasos del diagrama uno tras otro, para que el recorrido se
      lea como un camino y no como cuatro cajas sueltas.
   3. Contar las cifras de resultados.

   Va aparte del sistema del template a propósito: las animaciones GSAP del
   sitio están desactivadas (ver assets/js/gsap-animation.js) y el contador
   jQuery no sabe qué hacer con un placeholder tipo [X].

   Sin JavaScript la página se ve completa: el estado inicial escondido solo
   se aplica si este archivo corre y marca el documento con .sc-caso-js.
   ========================================================================== */
(function () {
  "use strict";

  var menosMovimiento =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var raiz = document.querySelector(".sc-caso") || document.body;

  /* Si el visitante pidió menos movimiento no escondemos nada: dejamos la
     página quieta y ya. */
  if (menosMovimiento || !("IntersectionObserver" in window)) {
    encenderTodo();
    return;
  }

  raiz.classList.add("sc-caso-js");

  /* Red de seguridad. El revelado esconde el contenido hasta que el
     observador avisa que entró en pantalla, así que si el observador no
     responde la página se queda en blanco. Ya pasó en un navegador
     automatizado: IntersectionObserver existía pero nunca llamaba al
     callback, ni sobre un elemento a la vista.

     Marcamos la primera respuesta del observador. Si a los 3 segundos no
     hubo ninguna, damos por hecho que no va a funcionar y mostramos todo.
     Cuando el observador anda, esto no se nota: la animación queda igual. */
  var observadorRespondio = false;
  setTimeout(function () {
    if (!observadorRespondio) encenderTodo();
  }, 3000);

  /* ----------------------------------------------------------------------
     1 · Revelado de bloques
     ---------------------------------------------------------------------- */
  var bloques = document.querySelectorAll(".sc-rv");
  if (bloques.length) {
    var obsRevelar = new IntersectionObserver(
      function (entradas) {
        observadorRespondio = true;
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          var retraso = parseInt(e.target.getAttribute("data-rv-delay") || "0", 10);
          setTimeout(function () {
            e.target.classList.add("is-in");
          }, retraso);
          obsRevelar.unobserve(e.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    );
    Array.prototype.forEach.call(bloques, function (b) {
      obsRevelar.observe(b);
    });
  }

  /* ----------------------------------------------------------------------
     2 · Recorrido del diagrama
     Cuando la lista entra en pantalla se encienden los pasos en cascada.
     ---------------------------------------------------------------------- */
  var lista = document.querySelector(".sc-caso-pasos");
  if (lista) {
    var pasos = lista.querySelectorAll(".sc-caso-paso");
    var obsFlujo = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          Array.prototype.forEach.call(pasos, function (p, i) {
            setTimeout(function () {
              p.classList.add("is-on");
            }, i * 420);
          });
          obsFlujo.unobserve(e.target);
        });
      },
      { threshold: 0.25 }
    );
    obsFlujo.observe(lista);
  }

  /* ----------------------------------------------------------------------
     3 · Cifras
     Solo cuenta si el valor es realmente un número. Con un placeholder como
     [X] o un texto como 24/7 lo deja tal cual, así el marcador se sigue
     viendo mientras el dato real no esté cargado.
     ---------------------------------------------------------------------- */
  var cifras = document.querySelectorAll("[data-contar]");
  if (cifras.length) {
    var obsCifras = new IntersectionObserver(
      function (entradas) {
        entradas.forEach(function (e) {
          if (!e.isIntersecting) return;
          contar(e.target);
          obsCifras.unobserve(e.target);
        });
      },
      { threshold: 0.5 }
    );
    Array.prototype.forEach.call(cifras, function (c) {
      obsCifras.observe(c);
    });
  }

  function contar(el) {
    var crudo = el.textContent.trim();
    var m = crudo.match(/^([^\d]*)(\d[\d.,]*)(.*)$/);
    if (!m) return; /* no hay número: es un placeholder o un texto, se respeta */

    var antes = m[1];
    var despues = m[3];
    var limpio = m[2].replace(/\./g, "").replace(/,/g, ".");
    var destino = parseFloat(limpio);
    if (isNaN(destino)) return;

    var decimales = (limpio.split(".")[1] || "").length;
    var duracion = 1100;
    var inicio = null;

    function paso(ahora) {
      if (inicio === null) inicio = ahora;
      var avance = Math.min((ahora - inicio) / duracion, 1);
      /* Desacelera al final, para que no frene de golpe */
      var suave = 1 - Math.pow(1 - avance, 3);
      var valor = (destino * suave).toFixed(decimales);
      el.textContent = antes + formatear(valor) + despues;
      if (avance < 1) requestAnimationFrame(paso);
    }
    requestAnimationFrame(paso);
  }

  function formatear(n) {
    var partes = String(n).split(".");
    partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(",");
  }

  /* Camino sin animación: todo visible y el recorrido dibujado entero. */
  function encenderTodo() {
    Array.prototype.forEach.call(document.querySelectorAll(".sc-rv"), function (b) {
      b.classList.add("is-in");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".sc-caso-paso"), function (p) {
      p.classList.add("is-on");
    });
  }
})();
