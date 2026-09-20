/* Panel de resultados del hero.
   Viene del preview que armó Sebastián (dev5.sebastiancanori.com.ar): las
   pestañas cambian el gráfico y los números se animan contando. Respeta
   prefers-reduced-motion y arranca la animación cuando el preloader empieza
   a desaparecer, no antes.
   Los números son ilustrativos y la tarjeta lo aclara abajo. */
(function () {
  var card = document.querySelector('.hero-dash-card');
  if (!card) return;
  var tabs = Array.prototype.slice.call(card.querySelectorAll('.hero-dash-card__tab'));
  var panels = Array.prototype.slice.call(card.querySelectorAll('.hero-dash-card__panel'));
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateStats(panel) {
    var values = panel.querySelectorAll('.hero-dash-card__stat-value');
    Array.prototype.forEach.call(values, function (el) {
      var target = parseFloat(el.getAttribute('data-count-to'));
      var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      var prefix = el.getAttribute('data-prefix') || '';
      var suffix = el.getAttribute('data-suffix') || '';
      function format(n) { return prefix + n.toFixed(decimals) + suffix; }
      if (reduceMotion) { el.textContent = format(target); return; }
      var duration = 900;
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = format(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = format(target);
      }
      requestAnimationFrame(step);
    });
  }

  function animateChart(panel) {
    var clipRect = panel.querySelector('.hero-dash-card__chart-clip-rect');
    if (!clipRect) return;
    var fullWidth = 320;
    clipRect.setAttribute('width', reduceMotion ? fullWidth : 0);
    if (reduceMotion) return;
    var duration = 900;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      clipRect.setAttribute('width', fullWidth * eased);
      if (progress < 1) requestAnimationFrame(step);
      else clipRect.setAttribute('width', fullWidth);
    }
    requestAnimationFrame(step);
  }

  function activate(tab) {
    tabs.forEach(function (t) {
      var isActive = t === tab;
      t.classList.toggle('hero-dash-card__tab--active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
      t.tabIndex = isActive ? 0 : -1;
    });
    var target = tab.getAttribute('data-tab-target');
    panels.forEach(function (p) {
      p.hidden = p.getAttribute('data-tab-panel') !== target;
    });
    var shown = panels.filter(function (p) { return p.getAttribute('data-tab-panel') === target; })[0];
    if (shown) {
      animateStats(shown);
      animateChart(shown);
    }
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function () { activate(tab); });
    tab.addEventListener('keydown', function (e) {
      var dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      var next = tabs[(i + dir + tabs.length) % tabs.length];
      next.focus();
      activate(next);
    });
  });

  var initialPanel = panels.filter(function (p) { return !p.hidden; })[0];
  function runInitialAnimation() {
    if (initialPanel) {
      animateStats(initialPanel);
      animateChart(initialPanel);
    }
  }

  // Start the first-view animation the instant the preloader begins
  // fading out (main.js adds "is-loaded" right before it calls
  // fadeOut), so the count-up/draw plays as the card is revealed
  // instead of finishing underneath the still-visible preloader.
  var preloader = document.querySelector('.preloader');
  if (preloader && !reduceMotion) {
    var started = false;
    function trigger() {
      if (started) return;
      started = true;
      runInitialAnimation();
    }
    if (preloader.classList.contains('is-loaded')) {
      trigger();
    } else {
      new MutationObserver(function (mutations, observer) {
        if (preloader.classList.contains('is-loaded')) {
          observer.disconnect();
          trigger();
        }
      }).observe(preloader, { attributes: true, attributeFilter: ['class'] });
      // Fallback in case the preloader script never runs (e.g. blocked).
      window.addEventListener('load', function () { setTimeout(trigger, 1700); });
    }
  } else {
    runInitialAnimation();
  }
})();
