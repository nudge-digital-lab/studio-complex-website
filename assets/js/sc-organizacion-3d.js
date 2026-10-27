/* Escena 3D interna de Studio Complex: los socios CEO orquestan, el MCP (cubo central)
   reparte el trabajo entre las direcciones (comercial, marketing, onboarding) y finance,
   y escribe en el plugin de clientes de WordPress, que es lo que ve cada cliente en su panel.
   Además, los agentes y los socios están conectados entre sí por arcos en el aire.
   Basada en la escena de assets/js/sc-simulador-3d.js. */
(function () {
  var stage = document.getElementById('sc-eco-stage');
  var canvas = document.getElementById('sc-eco-scene');
  var labelsEl = document.getElementById('sc-eco-labels');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var noHover = window.matchMedia('(hover: none)').matches;
  if (!window.THREE) { stage.classList.add('sc-eco-nogl'); return; }
  var renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: !!window.SC_ECO_CAPTURE }); }
  catch (e) { stage.classList.add('sc-eco-nogl'); return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  var ORANGE = 0xF2801E;
  var scene = new THREE.Scene();
  var cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  var target = new THREE.Vector3(-0.2, 0.4, -0.2);
  // cámara en órbita: el giro lo hace el mundo (yaw) y la inclinación la cámara (pitch)
  var CAM_R = Math.sqrt(14 * 14 * 2 + 12.5 * 12.5), PITCH0 = Math.atan2(12.5, Math.sqrt(14 * 14 * 2));
  var view = { yaw: 0, vYaw: 0, pitch: PITCH0, drag: null, moved: false, reset: false };
  function applyCam() {
    var h = CAM_R * Math.cos(view.pitch);
    cam.position.set(h / Math.SQRT2, CAM_R * Math.sin(view.pitch), h / Math.SQRT2).add(target);
    cam.lookAt(target);
  }
  applyCam();

  scene.add(new THREE.HemisphereLight(0xe4ecf2, 0x0b0f14, 0.5));
  var sun = new THREE.DirectionalLight(0xffffff, 0.75);
  sun.position.set(-7, 15, 9);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  var sc = sun.shadow.camera; sc.left = -13; sc.right = 13; sc.top = 13; sc.bottom = -13; sc.near = 1; sc.far = 45;
  sun.shadow.bias = -0.0008;
  scene.add(sun);
  var hubLight = new THREE.PointLight(ORANGE, 1.1, 8, 2);
  hubLight.position.set(0, 2.4, 0);
  scene.add(hubLight);

  var world = new THREE.Group();
  scene.add(world);

  /* ---------- texturas dibujadas en canvas ---------- */
  function tex(w, h, draw, linear) {
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    draw(c.getContext('2d'), w, h);
    var t = new THREE.CanvasTexture(c);
    if (!linear) t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 4;
    return t;
  }
  function rr(x, X, Y, W, H, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
  var SANS = 'system-ui, -apple-system, Segoe UI, sans-serif';

  var glowTex = tex(128, 128, function (x, w) {
    var g = x.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.22, 'rgba(255,255,255,.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, w);
  }, true);
  var stripTex = tex(4, 64, function (x, w, h) {
    var g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(.5, 'rgba(255,255,255,1)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }, true);
  var beamTex = tex(4, 128, function (x, w, h) {
    var g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,1)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }, true);

  function board(w, h, title, accent, draw) {
    return tex(w, h, function (x) {
      x.fillStyle = '#10151c'; x.fillRect(0, 0, w, h);
      x.fillStyle = '#1b232c'; x.fillRect(0, 0, w, 42);
      x.fillStyle = accent || '#F2801E'; rr(x, 16, 14, 14, 14, 4); x.fill();
      x.fillStyle = '#e8ecef'; x.font = '700 15px ' + SANS; x.fillText(title, 40, 27);
      draw(x, w, h);
    });
  }
  var comTex = board(512, 336, 'Dirección comercial · Leads', '#F2801E', function (x) {
    ['NUEVO', 'PROPUESTA', 'GANADO'].forEach(function (c, i) {
      var X = 14 + i * 166;
      x.fillStyle = '#151d26'; rr(x, X, 54, 152, 270, 10); x.fill();
      x.fillStyle = i === 2 ? '#F2801E' : '#8a939c'; x.font = '700 12px ' + SANS; x.fillText(c, X + 12, 76);
      for (var k = 0; k < [3, 2, 2][i]; k++) {
        var Y = 90 + k * 76, hot = i === 2 && k === 0;
        x.fillStyle = hot ? '#F2801E' : '#243040'; rr(x, X + 10, Y, 132, 64, 8); x.fill();
        x.fillStyle = hot ? '#ffffff' : '#c2cad2'; rr(x, X + 22, Y + 14, 84, 9, 4); x.fill();
        x.fillStyle = hot ? '#ffe2c8' : '#6d7a87'; rr(x, X + 22, Y + 32, 56, 8, 4); x.fill();
      }
    });
  });
  var mktTex = board(512, 320, 'Dirección de marketing · Campañas', '#22D3EE', function (x) {
    var hs = [60, 82, 74, 104, 96, 128, 120, 150, 162, 188];
    hs.forEach(function (hh, i) {
      var g = x.createLinearGradient(0, 290 - hh, 0, 290); g.addColorStop(0, '#22D3EE'); g.addColorStop(1, '#F2801E');
      x.fillStyle = g; rr(x, 30 + i * 46, 290 - hh, 30, hh, 6); x.fill();
    });
    x.strokeStyle = '#ffffff'; x.lineWidth = 3; x.beginPath();
    hs.forEach(function (hh, i) { var X = 45 + i * 46, Y = 270 - hh * 1.05; i ? x.lineTo(X, Y) : x.moveTo(X, Y); }); x.stroke();
    x.fillStyle = '#8a939c'; x.font = '600 13px ' + SANS; x.fillText('Ads · contenido · web', 30, 70);
  });
  var onbTex = board(512, 336, 'Dirección de onboarding · Alta', '#25D366', function (x) {
    ['Presupuesto aprobado', 'Seña cobrada', 'Accesos recibidos', 'Bienvenida enviada', 'Primera reunión'].forEach(function (t, i) {
      var Y = 64 + i * 52, ok = i < 4;
      x.fillStyle = '#151d26'; rr(x, 16, Y, 480, 42, 9); x.fill();
      x.fillStyle = ok ? '#25D366' : '#2c3743'; rr(x, 28, Y + 10, 22, 22, 6); x.fill();
      if (ok) { x.strokeStyle = '#0b141a'; x.lineWidth = 3.5; x.beginPath(); x.moveTo(33, Y + 21); x.lineTo(38, Y + 27); x.lineTo(46, Y + 15); x.stroke(); }
      x.fillStyle = ok ? '#e8ecef' : '#8a939c'; x.font = '600 16px ' + SANS; x.fillText(t, 64, Y + 27);
    });
  });
  var finTex = board(512, 320, 'Finance · Cobros y renovaciones', '#F2C94C', function (x) {
    [['Seña', 'Cobrada', '#25D366'], ['Saldo', 'Cobrado', '#25D366'], ['Plan mensual', 'Al día', '#25D366'], ['Dominio', 'Vence pronto', '#F2801E'], ['Hosting', 'Renovado', '#25D366']].forEach(function (r, i) {
      var Y = 58 + i * 50;
      x.fillStyle = i % 2 ? '#10151c' : '#151d26'; x.fillRect(12, Y, 488, 46);
      x.fillStyle = '#c2cad2'; x.font = '600 16px ' + SANS; x.fillText(r[0], 28, Y + 29);
      x.fillStyle = r[2]; rr(x, 330, Y + 10, 156, 26, 13); x.fill();
      x.fillStyle = '#0b141a'; x.font = '800 13px ' + SANS; x.textAlign = 'center'; x.fillText(r[1], 408, Y + 28); x.textAlign = 'left';
    });
  });
  var wpTex = tex(512, 320, function (x, w, h) {
    x.fillStyle = '#f0f0f1'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#1d2327'; x.fillRect(0, 0, w, 30); x.fillRect(0, 30, 108, h - 30);
    x.fillStyle = '#ffffff'; x.font = '700 13px ' + SANS; x.fillText('WordPress · Panel de clientes', 12, 20);
    ['Escritorio', 'Clientes', 'Servicios', 'Cobros', 'Tickets'].forEach(function (t, i) {
      x.fillStyle = i === 1 ? '#F2801E' : 'transparent'; if (i === 1) x.fillRect(0, 44 + i * 34, 108, 30);
      x.fillStyle = i === 1 ? '#ffffff' : '#a7aaad'; x.font = '600 13px ' + SANS; x.fillText(t, 14, 64 + i * 34);
    });
    x.fillStyle = '#1d2327'; x.font = '800 20px ' + SANS; x.fillText('Clientes', 128, 66);
    x.fillStyle = '#F2801E'; rr(x, 226, 48, 96, 26, 5); x.fill(); x.fillStyle = '#ffffff'; x.font = '700 12px ' + SANS; x.fillText('Agregar', 250, 66);
    for (var i = 0; i < 6; i++) {
      var Y = 88 + i * 36;
      x.fillStyle = '#ffffff'; x.fillRect(124, Y, 372, 34);
      x.fillStyle = '#c3c4c7'; rr(x, 136, Y + 12, 120, 10, 5); x.fill(); rr(x, 280, Y + 12, 80, 10, 5); x.fill();
      x.fillStyle = i === 0 ? '#F2801E' : '#25D366'; rr(x, 400, Y + 9, 80, 16, 8); x.fill();
    }
  });
  var portalTex = tex(256, 512, function (x, w, h) {
    x.fillStyle = '#0f141a'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#F2801E'; rr(x, 16, 24, 30, 30, 8); x.fill();
    x.fillStyle = '#e8ecef'; x.font = '800 18px ' + SANS; x.fillText('Tu proyecto', 56, 46);
    x.fillStyle = '#8a939c'; x.font = '600 12px ' + SANS; x.fillText('AVANCE', 18, 92);
    x.fillStyle = '#1b232c'; rr(x, 18, 102, 220, 14, 7); x.fill(); x.fillStyle = '#F2801E'; rr(x, 18, 102, 160, 14, 7); x.fill();
    ['Diseño', 'Desarrollo', 'Publicación'].forEach(function (t, i) {
      var Y = 140 + i * 58;
      x.fillStyle = '#1b232c'; rr(x, 18, Y, 220, 46, 9); x.fill();
      x.fillStyle = i < 2 ? '#25D366' : '#5b6672'; x.beginPath(); x.arc(40, Y + 23, 8, 0, 7); x.fill();
      x.fillStyle = '#e8ecef'; x.font = '600 14px ' + SANS; x.fillText(t, 58, Y + 28);
    });
    x.fillStyle = '#1b232c'; rr(x, 18, 330, 220, 70, 9); x.fill();
    x.fillStyle = '#8a939c'; x.font = '600 12px ' + SANS; x.fillText('PRÓXIMO COBRO', 32, 356);
    x.fillStyle = '#e8ecef'; x.font = '800 16px ' + SANS; x.fillText('Plan mensual · al día', 32, 382);
  });
  var mcpTex = tex(128, 128, function (x, w, h) { x.fillStyle = '#fff3e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#F2801E'; x.font = '800 38px ' + SANS; x.textAlign = 'center'; x.fillText('MCP', w / 2, 76); });
  var ceoTex = tex(256, 80, function (x, w, h) { x.fillStyle = '#F2801E'; x.fillRect(0, 0, w, h); x.fillStyle = '#0b0f14'; x.font = '800 30px ' + SANS; x.textAlign = 'center'; x.fillText('SOCIOS CEO', w / 2, 52); });
  var wTex = tex(128, 128, function (x, w, h) { x.fillStyle = '#ffffff'; x.beginPath(); x.arc(64, 64, 62, 0, 7); x.fill(); x.fillStyle = '#21759B'; x.beginPath(); x.arc(64, 64, 54, 0, 7); x.fill(); x.fillStyle = '#ffffff'; x.font = '800 70px Georgia, serif'; x.textAlign = 'center'; x.fillText('W', 64, 88); });
  /* ---------- materiales y geometría ---------- */
  function std(c, o) { var p = { color: c, roughness: .62, metalness: .04 }; for (var k in o) p[k] = o[k]; return new THREE.MeshStandardMaterial(p); }
  var M = {
    white: std(0xeef1f3), light: std(0xc5cdd4), dark: std(0x1c242d), darker: std(0x0c1117),
    top: std(0x0e141b, { roughness: .4, metalness: .2 }), grass: std(0x4b765f), tree: std(0x5f9a76, { flatShading: true }),
    trunk: std(0x6b4f3a), road: std(0x151b22, { roughness: .9 }),
    warm: std(0xffd3a6, { emissive: 0xF2801E, emissiveIntensity: .45 }), orange: std(ORANGE, { roughness: .5 })
  };
  function mesh(g, m) { var o = new THREE.Mesh(g, m); o.castShadow = true; o.receiveShadow = true; return o; }
  function box(w, h, d, m) { return mesh(new THREE.BoxGeometry(w, h, d), m); }
  function add(parent, obj, x, y, z) { obj.position.set(x || 0, y || 0, z || 0); parent.add(obj); return obj; }
  function glowMat(o, c) { return new THREE.MeshBasicMaterial({ color: c || ORANGE, transparent: true, opacity: o, blending: THREE.AdditiveBlending, depthWrite: false }); }
  function rbox(w, h, d, r) {
    var s = new THREE.Shape(), x = -w / 2, y = -d / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r); s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d); s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
    var g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 6 });
    g.rotateX(-Math.PI / 2);
    return g;
  }
  function screen(w, h, map) {
    var g = new THREE.Group();
    add(g, box(w + .09, h + .09, .07, M.dark));
    add(g, new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: map })), 0, 0, .037);
    return g;
  }

  var TOP = .42;
  function platform(size) {
    var g = new THREE.Group();
    add(g, mesh(rbox(size, .3, size, .32), M.darker));
    var rim = add(g, new THREE.Mesh(rbox(size + .05, .05, size + .05, .34), new THREE.MeshBasicMaterial({ color: ORANGE, transparent: true, opacity: .7 })), 0, .2, 0);
    var top = add(g, mesh(rbox(size - .14, .12, size - .14, .26), M.top), 0, .3, 0);
    var halo = new THREE.Mesh(new THREE.PlaneGeometry(size * 2.1, size * 2.1), new THREE.MeshBasicMaterial({ map: glowTex, color: ORANGE, transparent: true, opacity: .13, blending: THREE.AdditiveBlending, depthWrite: false }));
    halo.rotation.x = -Math.PI / 2; add(g, halo, 0, .02, 0);
    g.userData.rim = rim; g.userData.halo = halo; g.userData.top = top;
    return g;
  }

  function robot() {
    // agente de IA: cuerpo, cabeza con visor y antena
    var g = new THREE.Group(), eye = new THREE.MeshBasicMaterial({ color: ORANGE });
    add(g, mesh(rbox(.36, .42, .28, .08), M.white), 0, 0, 0);
    add(g, box(.3, .08, .02, M.dark), 0, .26, .145);
    var head = add(g, new THREE.Group(), 0, .58, 0);
    add(head, mesh(rbox(.4, .28, .32, .09), M.white), 0, -.14, 0);
    add(head, box(.32, .14, .02, M.darker), 0, 0, .165);
    add(head, new THREE.Mesh(new THREE.BoxGeometry(.06, .05, .01), eye), -.07, 0, .177);
    add(head, new THREE.Mesh(new THREE.BoxGeometry(.06, .05, .01), eye), .07, 0, .177);
    add(head, box(.02, .14, .02, M.light), 0, .2, 0);
    add(head, new THREE.Mesh(new THREE.SphereGeometry(.045, 12, 8), eye), 0, .28, 0);
    g.userData.head = head;
    return g;
  }
  function person(c) {
    var g = new THREE.Group();
    add(g, mesh(new THREE.CylinderGeometry(.15, .2, .55, 16), std(c)), 0, .28, 0);
    add(g, mesh(new THREE.SphereGeometry(.13, 16, 12), std(0xe9c9a8)), 0, .7, 0);
    return g;
  }
  function stand(map, w, h) {
    var g = new THREE.Group();
    add(g, box(.07, 1.05, .07, M.light), -w / 2 + .2, .52, -.05).rotation.x = .08;
    add(g, box(.07, 1.05, .07, M.light), w / 2 - .2, .52, -.05).rotation.x = .08;
    add(g, screen(w, h, map), 0, 1.18, .04).rotation.x = -.08;
    return g;
  }
  function withAgent(obj) {
    var g = new THREE.Group();
    add(g, obj, -.18, 0, -.18);
    var r = add(g, robot(), .55, 0, .55); r.rotation.y = Math.PI / 4;
    g.userData.agent = r;
    g.rotation.y = 0;
    return g;
  }
  function oComercial() { var s = stand(comTex, 1.5, .98); s.rotation.y = Math.PI / 4; return withAgent(s); }
  function oMarketing() { var s = stand(mktTex, 1.5, .94); s.rotation.y = Math.PI / 4; return withAgent(s); }
  function oOnboarding() { var s = stand(onbTex, 1.5, .98); s.rotation.y = Math.PI / 4; return withAgent(s); }
  function oFinance() {
    var g = new THREE.Group();
    var s = add(g, stand(finTex, 1.4, .88), -.2, 0, -.2); s.rotation.y = Math.PI / 4;
    var gold = std(0xF2C94C, { metalness: .5, roughness: .35 });
    [[.62, .1, 6], [.85, -.1, 4], [.42, .36, 3]].forEach(function (c) {
      for (var i = 0; i < c[2]; i++) add(g, mesh(new THREE.CylinderGeometry(.12, .12, .04, 20), gold), c[0], .02 + i * .045, c[1] + .5);
    });
    var p = add(g, person(0x2c3743), .7, 0, -.55); p.rotation.y = Math.PI / 4;
    return g;
  }
  function oSocios() {
    var g = new THREE.Group();
    add(g, mesh(rbox(1.5, .18, 1.5, .2), M.dark), 0, 0, 0);
    add(g, new THREE.Mesh(rbox(1.56, .03, 1.56, .22), glowMat(.3)), 0, .17, 0);
    add(g, mesh(new THREE.CylinderGeometry(.34, .34, .05, 24), M.light), 0, .5, 0);
    add(g, mesh(new THREE.CylinderGeometry(.05, .05, .32, 8), M.light), 0, .34, 0);
    add(g, person(ORANGE), -.42, .18, .1);
    add(g, person(0xeef1f3), .42, .18, -.1);
    var tag = add(g, new THREE.Group(), 0, 1.6, 0);
    add(tag, screen(1.0, .31, ceoTex)).rotation.y = Math.PI / 4;
    g.userData.bob = tag; g.userData.bobY = 1.6;
    return g;
  }
  function oWordPress() {
    var g = new THREE.Group(), leds = [];
    add(g, box(.56, 1.1, .6, M.white), -.62, .55, -.2);
    add(g, box(.46, .98, .02, M.dark), -.62, .55, .105);
    for (var r = 0; r < 6; r++) {
      var led = add(g, new THREE.Mesh(new THREE.BoxGeometry(.05, .03, .01), new THREE.MeshBasicMaterial({ color: r % 2 ? 0x25D366 : ORANGE, transparent: true })), -.5, .2 + r * .15, .117);
      led.userData.ph = Math.random() * 6; leds.push(led);
    }
    g.userData.leds = leds;
    var m = add(g, new THREE.Group(), .25, 0, .1);
    add(m, box(.6, .05, .36, M.light), 0, .025, 0);
    add(m, box(.08, .5, .07, M.light), 0, .27, -.05);
    add(m, screen(1.3, .82, wpTex), 0, .9, 0);
    m.rotation.y = Math.PI / 4;
    var badge = add(g, new THREE.Group(), -.62, 1.55, -.2);
    var w = add(badge, new THREE.Mesh(new THREE.CircleGeometry(.24, 32), new THREE.MeshBasicMaterial({ map: wTex, transparent: true }))); w.rotation.y = Math.PI / 4;
    g.userData.bob = badge; g.userData.bobY = 1.55;
    return g;
  }
  function oClientes() {
    var g = new THREE.Group();
    [[-.45, -.4, .9], [.15, -.55, 1.3], [-.55, .3, .6]].forEach(function (b) {
      add(g, box(.5, b[2], .5, M.white), b[0], b[2] / 2, b[1]);
      for (var y = .2; y < b[2] - .1; y += .22) add(g, box(.36, .1, .02, M.warm), b[0], y, b[1] + .26);
    });
    var tilt = add(g, new THREE.Group(), .5, 0, .45); tilt.rotation.y = Math.PI / 4;
    add(tilt, box(.46, .06, .3, M.light), 0, .03, 0);
    var t2 = add(tilt, new THREE.Group(), 0, .06, 0); t2.rotation.x = -.14;
    add(t2, box(.6, 1.1, .08, M.dark), 0, .57, 0);
    add(t2, new THREE.Mesh(new THREE.PlaneGeometry(.53, 1.02), new THREE.MeshBasicMaterial({ map: portalTex })), 0, .57, .042);
    return g;
  }
  /* ---------- centro ---------- */
  var hub = platform(3.0);
  world.add(hub);
  var plate = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 1.9), new THREE.MeshBasicMaterial({ color: 0xffe9d6, transparent: true, opacity: .92 }));
  plate.rotation.x = -Math.PI / 2; add(hub, plate, 0, TOP + .005, 0);
  var plateGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), new THREE.MeshBasicMaterial({ map: glowTex, color: ORANGE, transparent: true, opacity: .55, blending: THREE.AdditiveBlending, depthWrite: false }));
  plateGlow.rotation.x = -Math.PI / 2; add(hub, plateGlow, 0, TOP + .01, 0);
  var glass = add(hub, new THREE.Mesh(new THREE.BoxGeometry(1.75, 1.75, 1.75), new THREE.MeshStandardMaterial({ color: 0xffd9b8, transparent: true, opacity: .1, roughness: .1, depthWrite: false })), 0, TOP + .9, 0);
  add(glass, new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.75, 1.75, 1.75)), new THREE.LineBasicMaterial({ color: 0xffc996, transparent: true, opacity: .6 })));
  var coreMat = std(0xfff3e8, { emissive: ORANGE, emissiveIntensity: .55, roughness: .3 });
  coreMat.map = mcpTex;
  var core = add(hub, mesh(new THREE.BoxGeometry(.62, .62, .62), coreMat), 0, TOP + 1.0, 0);
  var beam = add(hub, new THREE.Mesh(new THREE.CylinderGeometry(.95, .95, 2.8, 40, 1, true), new THREE.MeshBasicMaterial({ map: beamTex, color: ORANGE, transparent: true, opacity: .2, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })), 0, TOP + 1.4, 0);
  var motes = (function () {
    var n = 40, pos = new Float32Array(n * 3);
    for (var i = 0; i < n; i++) { pos[i * 3] = (Math.random() - .5) * 1.5; pos[i * 3 + 1] = Math.random() * 1.6; pos[i * 3 + 2] = (Math.random() - .5) * 1.5; }
    var g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return add(hub, new THREE.Points(g, new THREE.PointsMaterial({ color: 0xffc48a, size: 2.2, sizeAttenuation: false, transparent: true, opacity: .8, blending: THREE.AdditiveBlending, depthWrite: false })), 0, TOP + .1, 0);
  })();

  /* ---------- bases ---------- */
  var NODES = [
    { key: 'com', label: 'Dirección comercial', corto: 'Comercial', x: -3.8, z: 0, make: oComercial },
    { key: 'ceo', label: 'Socios CEO · orquestadores', corto: 'Socios CEO', x: -2.7, z: -2.8, make: oSocios },
    { key: 'mkt', label: 'Dirección de marketing', corto: 'Marketing', x: 0, z: -3.8, make: oMarketing },
    { key: 'onb', label: 'Dirección de onboarding', corto: 'Onboarding', x: 2.7, z: -2.8, make: oOnboarding },
    { key: 'fin', label: 'Departamento de finance', corto: 'Finance', x: 3.8, z: 0, make: oFinance },
    { key: 'wp', label: 'WordPress · plugin de clientes', corto: 'WordPress', x: 0, z: 3.8, make: oWordPress },
    { key: 'cli', label: 'Clientes · su panel', corto: 'Clientes', x: 2.8, z: 2.9, make: oClientes }
  ];
  var byKey = {};
  NODES.forEach(function (n, i) {
    n.size = 2.1;
    n.group = platform(n.size);
    n.group.position.set(n.x, 0, n.z);
    n.obj = n.make(); n.obj.position.y = TOP; n.group.add(n.obj);
    n.group.traverse(function (o) { o.userData.node = n; });
    n.delay = .25 + i * .11; n.lift = 0; n.hover = 0;
    world.add(n.group);
    var el = document.createElement('span'); el.className = 'sc-eco-lbl'; el.textContent = n.label; labelsEl.appendChild(el); n.el = el;
    byKey[n.key] = n;
  });
  hub.position.set(0, 0, 0); hub.userData.delay = 0;

  /* ---------- conexiones ---------- */
  var links = [];
  function link(a, b, dir) {
    var A = new THREE.Vector3(a.x, .04, a.z), B = new THREE.Vector3(b.x, .04, b.z);
    var len = A.distanceTo(B), g = new THREE.Group();
    g.position.copy(A); g.rotation.y = -Math.atan2(B.z - A.z, B.x - A.x);
    var core = new THREE.Mesh(new THREE.PlaneGeometry(len, .05), glowMat(.6)); core.geometry.translate(len / 2, 0, 0); core.rotation.x = -Math.PI / 2; g.add(core);
    var soft = new THREE.Mesh(new THREE.PlaneGeometry(len, .5), new THREE.MeshBasicMaterial({ map: stripTex, color: ORANGE, transparent: true, opacity: .14, blending: THREE.AdditiveBlending, depthWrite: false })); soft.geometry.translate(len / 2, 0, 0); soft.rotation.x = -Math.PI / 2; g.add(soft);
    g.scale.x = 0.0001; world.add(g);
    var l = { A: A, B: B, len: len, g: g, core: core, dir: dir, from: a, to: b, next: 1 + Math.random() * 2 };
    links.push(l); return l;
  }
  var H = { x: 0, z: 0, key: 'hub' };
  // los socios orquestan: mandan al MCP; las direcciones y finance van y vuelven; el MCP escribe en WordPress y eso llega al panel del cliente
  link(byKey.ceo, H, 1);
  ['com', 'mkt', 'onb', 'fin'].forEach(function (k) { link(H, byKey[k], 2); });
  link(H, byKey.wp, 1);
  link(byKey.wp, byKey.cli, 1);

  /* ---------- red entre agentes: arcos por el aire de antena a antena ---------- */
  // punto de conexión de cada agente (la antena del robot, la cabeza de la persona de finance, la mesa de los socios)
  var PORT = { com: [.55, 1.02, .55], mkt: [.55, 1.02, .55], onb: [.55, 1.02, .55], fin: [.7, .85, -.55], ceo: [0, .75, 0] };
  function portOf(k) { var n = byKey[k], o = PORT[k]; return new THREE.Vector3(n.x + o[0], TOP + o[1], n.z + o[2]); }
  var arcs = [], arcPulses = [];
  function arc(ka, kb) {
    var A = portOf(ka), B = portOf(kb), d = A.distanceTo(B);
    var M = A.clone().add(B).multiplyScalar(.5); M.y += 1.1 + d * .32;
    var curve = new THREE.QuadraticBezierCurve3(A, M, B);
    var geo = new THREE.TubeGeometry(curve, 64, .016, 6, false);
    var tube = new THREE.Mesh(geo, glowMat(.5, 0xffb36b)); world.add(tube);
    var halo = new THREE.Mesh(new THREE.TubeGeometry(curve, 64, .07, 6, false), glowMat(.08)); world.add(halo);
    geo.setDrawRange(0, 0); halo.geometry.setDrawRange(0, 0);
    var a = { c: curve, tube: tube, halo: halo, n: geo.index.count, from: byKey[ka], to: byKey[kb], next: 2 + Math.random() * 4 };
    arcs.push(a); return a;
  }
  var AG = ['com', 'mkt', 'onb', 'fin'];
  for (var ai = 0; ai < AG.length; ai++) for (var aj = ai + 1; aj < AG.length; aj++) arc(AG[ai], AG[aj]);
  AG.forEach(function (k) { arc('ceo', k); });

  /* ---------- guion: cómo trabajan los agentes entre sí ----------
     Recorre flujos reales del panel (herramientas del MCP de studio-complex-panel).
     Cada paso viaja por su camino: arco entre agentes, o por el MCP hasta WordPress. */
  var FLOWS = [
    { t: 'Entra un cliente nuevo', s: [
      ['mkt', 'com', 'arc', 'ticket_abrir', 'Llegó una consulta de la web: va a Ventas'],
      ['com', 'ceo', 'arc', 'nota_agregar', 'Propuesta lista para aprobar'],
      ['ceo', 'com', 'arc', 'OK', 'Los socios la aprueban'],
      ['com', 'onb', 'arc', 'cliente_alta', 'Cerró: onboarding arma la ficha'],
      ['onb', 'wp', 'mcp', 'cliente_alta', 'Ficha y servicios creados en el plugin'],
      ['onb', 'fin', 'arc', 'servicio_agregar', 'Seña a cobrar'],
      ['fin', 'wp', 'mcp', 'comprobante_revisar', 'Seña acreditada y facturada'],
      ['wp', 'cli', 'cli', 'mail_enviar', 'El cliente recibe el acceso a su panel']
    ] },
    { t: 'Renovación del mes', s: [
      ['fin', 'wp', 'mcp', 'panel_resumen', 'Finance revisa qué vence en 30 días'],
      ['fin', 'ceo', 'arc', 'mail_cliente', 'Aviso con vista previa para aprobar'],
      ['ceo', 'fin', 'arc', 'OK', 'Aprobado: sale el aviso'],
      ['wp', 'cli', 'cli', 'mail_cliente', 'El cliente paga desde su panel'],
      ['fin', 'wp', 'mcp', 'servicio_renovar', 'Pago acreditado, servicio renovado']
    ] },
    { t: 'Soporte y resultados', s: [
      ['onb', 'wp', 'mcp', 'ticket_abrir', 'El cliente abre un ticket desde su panel'],
      ['onb', 'com', 'arc', 'tickets_listar', '¿Es un pedido nuevo? Pasa a comercial'],
      ['com', 'mkt', 'arc', 'nota_agregar', 'Marketing suma la campaña al plan'],
      ['mkt', 'wp', 'mcp', 'campanas_publicar', 'Resultados de la campaña al panel'],
      ['mkt', 'onb', 'arc', 'proyecto_publicar', 'Onboarding actualiza "Tu proyecto"'],
      ['wp', 'cli', 'cli', 'proyecto_publicar', 'El cliente ve todo al día']
    ] }
  ];
  var NAME = { ceo: 'Socios CEO', com: 'Comercial', mkt: 'Marketing', onb: 'Onboarding', fin: 'Finance', wp: 'MCP · WordPress', cli: 'Cliente' };
  var hud = document.createElement('div'); hud.className = 'sc-eco-hud'; hud.setAttribute('aria-live', 'polite');
  hud.innerHTML = '<span class="sc-eco-hud-f"></span><b class="sc-eco-hud-r"></b><span class="sc-eco-hud-t"></span><code class="sc-eco-hud-c"></code><ol class="sc-eco-hud-p"></ol>';
  stage.appendChild(hud);
  var cap = document.createElement('span'); cap.className = 'sc-eco-cap'; labelsEl.appendChild(cap);
  var hudF = hud.querySelector('.sc-eco-hud-f'), hudR = hud.querySelector('.sc-eco-hud-r'), hudT = hud.querySelector('.sc-eco-hud-t'), hudC = hud.querySelector('.sc-eco-hud-c'), hudP = hud.querySelector('.sc-eco-hud-p');
  var bigMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffd0a0, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  var bigS = new THREE.Sprite(bigMat); bigS.scale.set(1.1, 1.1, 1); bigS.visible = false; world.add(bigS);
  var bigBox = mesh(new THREE.BoxGeometry(.2, .2, .2), M.orange); bigBox.visible = false; world.add(bigBox);
  function floorPt(k) { if (k === 'hub') return new THREE.Vector3(0, .2, 0); var n = byKey[k]; return new THREE.Vector3(n.x, .2, n.z); }
  function polyline(pts) {
    var L = [0]; for (var i = 1; i < pts.length; i++) L.push(L[i - 1] + pts[i].distanceTo(pts[i - 1]));
    return { len: L[L.length - 1], at: function (u, out) {
      var d = u * L[L.length - 1], i = 1; while (i < L.length - 1 && L[i] < d) i++;
      var f = (d - L[i - 1]) / Math.max(1e-6, L[i] - L[i - 1]); return out.copy(pts[i - 1]).lerp(pts[i], f);
    } };
  }
  function pathFor(st) {
    if (st[2] === 'arc') {
      for (var i = 0; i < arcs.length; i++) {
        var a = arcs[i];
        if (a.from.key === st[0] && a.to.key === st[1]) return { len: a.c.getLength(), at: function (u, o) { return a.c.getPoint(u, o); }, arc: a };
        if (a.from.key === st[1] && a.to.key === st[0]) return { len: a.c.getLength(), at: function (u, o) { return a.c.getPoint(1 - u, o); }, arc: a };
      }
    }
    if (st[2] === 'mcp') return polyline([floorPt(st[0]), floorPt('hub'), floorPt(st[1])]);
    return polyline([floorPt(st[0]), floorPt(st[1])]);
  }
  // ficha de cada base: qué hace y cómo trabaja (las herramientas son las del MCP de studio-complex-panel)
  var INFO = {
    ceo: { k: 'Socios CEO · orquestadores', h: 'Dan las órdenes, reparten el trabajo entre los agentes y aprueban todo lo que llega a un cliente.',
      p: ['Piden en lenguaje común: "armame el plan de la semana", "avisale a este cliente".', 'Reciben cada propuesta y cada mail con vista previa.', 'Aprueban o corrigen. Sin ese OK no sale nada.', 'Ven el estado de todo en el Panel Agencia: MRR, vencimientos y tickets.'],
      t: ['panel_resumen', 'clientes_listar', 'finanzas_ver'] },
    com: { k: 'Dirección · agente', h: 'Toma cada consulta, la califica y la lleva hasta la propuesta. Busca qué más ofrecerles a los clientes actuales.',
      p: ['Recibe la consulta de Marketing como ticket de Ventas.', 'Lee la ficha y el historial del cliente.', 'Arma la propuesta y la deja para que la aprueben los socios.', 'Si cierra, le pasa el cliente a Onboarding.'],
      t: ['tickets_listar', 'cliente_ver', 'nota_agregar', 'cliente_crear'] },
    mkt: { k: 'Dirección · agente', h: 'Trae las consultas con campañas, contenido y la web, y le muestra al cliente los resultados.',
      p: ['Las campañas y la web generan consultas.', 'Cada consulta entra como ticket de Ventas para Comercial.', 'Publica los resultados de cada campaña en el panel del cliente.', 'Comunica las novedades en todos los paneles.'],
      t: ['ticket_abrir', 'campanas_publicar', 'panel_banner'] },
    onb: { k: 'Dirección · agente', h: 'Convierte un sí en un cliente andando: ficha, servicios, accesos y bienvenida.',
      p: ['Recibe de Comercial el cliente que cerró.', 'Crea la ficha con sus servicios en el plugin.', 'Le pide a Finance que cobre la seña.', 'Le manda el acceso a su panel y publica "Tu proyecto".'],
      t: ['cliente_alta', 'servicio_agregar', 'mail_enviar', 'proyecto_publicar'] },
    fin: { k: 'Departamento', h: 'Lleva la plata: señas, saldos, planes mensuales, renovaciones y facturas.',
      p: ['Revisa qué vence en los próximos 30 días.', 'Prepara el aviso al cliente con vista previa para los socios.', 'Acredita los comprobantes que sube el cliente.', 'Renueva el servicio y registra la factura.'],
      t: ['panel_resumen', 'mail_cliente', 'comprobante_revisar', 'servicio_renovar', 'factura_agregar'] },
    wp: { k: 'La base · MCP + WordPress', h: 'El plugin de clientes: fichas, servicios, cobros, mails y tickets con osTicket. Los agentes lo manejan por el MCP.',
      p: ['Un agente pide algo por el MCP.', 'El plugin lo guarda y deja una nota en la ficha.', 'Lo que manda un mail pasa antes por vista previa.', 'Lo que cambia aparece en el panel del cliente.'],
      t: ['cliente_ver', 'servicio_editar', 'mails_listar', 'backup_base'] },
    cli: { k: 'El cliente', h: 'Su panel privado: próximo pago, servicios, proyecto, campañas y soporte.',
      p: ['Entra con un link que le llega por mail, sin contraseña.', 'Ve su próximo pago, sus servicios y cómo va su proyecto.', 'Paga o sube el comprobante desde ahí.', 'Abre tickets y consulta el centro de ayuda.'],
      t: ['cliente_link_entrada', 'panel_acceso'] }
  };
  var sel = null;
  var card = document.createElement('div'); card.className = 'sc-eco-card'; card.hidden = true; stage.appendChild(card);
  function chips(keys) { return keys.length ? keys.map(function (k) { return '<button type="button" class="sc-eco-chip" data-k="' + k + '">' + NAME[k] + '</button>'; }).join('') : '<span class="sc-eco-none">—</span>'; }
  function conexiones(key) {
    var de = [], a = [];
    FLOWS.forEach(function (F) { F.s.forEach(function (st) {
      if (st[1] === key && de.indexOf(st[0]) < 0) de.push(st[0]);
      if (st[0] === key && a.indexOf(st[1]) < 0) a.push(st[1]);
    }); });
    return { de: de, a: a };
  }
  function pintarCard(n) {
    var I = INFO[n.key], c = conexiones(n.key);
    card.innerHTML = '<button type="button" class="sc-eco-x" aria-label="Cerrar">×</button>' +
      '<span class="sc-eco-k">' + I.k + '</span><h3>' + n.label + '</h3><p>' + I.h + '</p>' +
      '<h4>Cómo trabaja</h4><ol>' + I.p.map(function (s) { return '<li>' + s + '</li>'; }).join('') + '</ol>' +
      '<h4>Recibe trabajo de</h4><div class="sc-eco-chips">' + chips(c.de) + '</div>' +
      '<h4>Le pasa trabajo a</h4><div class="sc-eco-chips">' + chips(c.a) + '</div>' +
      '<h4>Herramientas del MCP</h4><div class="sc-eco-tools">' + I.t.map(function (t) { return '<code>' + t + '</code>'; }).join('') + '</div>';
    card.hidden = false; card.classList.remove('in'); void card.offsetWidth; card.classList.add('in');
  }
  card.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('sc-eco-x')) seleccionar(null);
    else if (b.dataset.k) seleccionar(byKey[b.dataset.k]);
  });
  var startAnim = null;
  function seleccionar(n) {
    if (n === sel) n = null;
    sel = n;
    NODES.forEach(function (m) { m.sel = m === n; });
    if (n) pintarCard(n); else { card.hidden = true; }
    stage.classList.toggle('has-card', !!n);
    D.pl = lista(n ? n.key : null); D.k = -1; D.wait = .25;
    if (D.path && D.path.arc) D.path.arc.focus = 0;
    D.path = null; bigS.visible = bigBox.visible = false; cap.style.opacity = 0;
    hudP.innerHTML = '';
    if (n && reduce && startAnim) startAnim();
    if (reduce || !running) { encuadre(true); render(); }
  }
  // lista de pasos a mostrar: todos los flujos, o solo los pasos donde participa el agente elegido
  function lista(key) {
    var pl = [];
    FLOWS.forEach(function (F, fi) {
      var steps = F.s.filter(function (st) { return !key || st[0] === key || st[1] === key; });
      steps.forEach(function (st, i) { pl.push({ title: key ? 'Cómo trabaja ' + NAME[key] + ' · ' + F.t : 'Flujo ' + (fi + 1) + ' de ' + FLOWS.length + ' · ' + F.t, st: st, i: i, n: steps.length }); });
    });
    return pl;
  }
  var D = { pl: lista(null), k: -1, t: 0, wait: .4, path: null, hubHit: false };
  function startStep() {
    var it = D.pl[D.k], st = it.st;
    NODES.forEach(function (n) { n.focus = n.key === st[0] || n.key === st[1]; });
    D.path = pathFor(st); D.t = 0; D.hubHit = false;
    if (D.path.arc) D.path.arc.focus = 1;
    hudF.textContent = it.title;
    hudR.textContent = NAME[st[0]] + '  →  ' + NAME[st[1]];
    hudT.textContent = st[4]; hudC.textContent = st[3];
    cap.textContent = st[3];
    if (hudP.children.length !== it.n || it.i === 0) hudP.innerHTML = new Array(it.n + 1).join('<li></li>');
    [].forEach.call(hudP.children, function (li, i) { li.className = i < it.i ? 'ok' : i === it.i ? 'on' : ''; });
    hud.classList.remove('in'); void hud.offsetWidth; hud.classList.add('in');
    bigS.visible = bigBox.visible = true;
  }
  function director(dt) {
    if (!D.path) { D.wait -= dt; if (D.wait <= 0) next(); return; }
    D.t += dt * 3.2 / Math.max(2, D.path.len);
    var u = clamp(D.t);
    D.path.at(u, bigS.position); bigBox.position.copy(bigS.position); bigBox.position.y += .02; bigBox.rotation.y += dt * 4;
    bigS.material.opacity = Math.min(1, u * 8, (1 - u) * 8 + .2);
    var st = D.pl[D.k].st;
    if (st[2] === 'mcp' && !D.hubHit && u > .5) { D.hubHit = true; hubFlash = 1; }
    if (u >= 1) {
      var dest = byKey[st[1]]; if (dest) dest.ping = 1.4;
      if (D.path.arc) D.path.arc.focus = 0;
      D.path = null; D.wait = .9; bigS.visible = bigBox.visible = false; cap.style.opacity = 0;
    }
  }
  function next() { D.k = (D.k + 1) % D.pl.length; startStep(); }
  function spawnArc(a) {
    var s = new THREE.Sprite(pulseMat.clone()); s.scale.set(.5, .5, 1); world.add(s);
    arcPulses.push({ s: s, a: a, t: 0, rev: Math.random() < .5, v: .45 + Math.random() * .25 });
  }

  /* ---------- consultas que entran a la dirección comercial ---------- */
  var adsTop = new THREE.Vector3(byKey.com.x, 1.25, byKey.com.z);
  var screenLeft = new THREE.Vector3(-1, 0, 1).normalize(), screenUp = new THREE.Vector3(-1, 0, -1).normalize();
  var streaks = [], N = 64;
  var lpos = new Float32Array(N * 6), lcol = new Float32Array(N * 6);
  for (var i = 0; i < N; i++) {
    var src = adsTop.clone().addScaledVector(screenLeft, 11 + Math.random() * 4).addScaledVector(screenUp, (Math.random() - .5) * 7);
    src.y = .2 + Math.random() * 4.2;
    var end = adsTop.clone().add(new THREE.Vector3((Math.random() - .5) * .3, (Math.random() - .5) * .5, (Math.random() - .5) * .3));
    streaks.push({ s: src, e: end, t: Math.random(), v: .25 + Math.random() * .35 });
    lpos.set([src.x, src.y, src.z, end.x, end.y, end.z], i * 6);
    lcol.set([0, 0, 0, .95, .5, .12], i * 6);
  }
  var lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.BufferAttribute(lpos, 3)); lg.setAttribute('color', new THREE.BufferAttribute(lcol, 3));
  var streakLines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: .45, blending: THREE.AdditiveBlending, depthWrite: false }));
  world.add(streakLines);
  var dotPos = new Float32Array(N * 3), dg = new THREE.BufferGeometry();
  dg.setAttribute('position', new THREE.BufferAttribute(dotPos, 3));
  var dots = new THREE.Points(dg, new THREE.PointsMaterial({ color: 0xffc48a, size: 3.2, sizeAttenuation: false, map: glowTex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
  world.add(dots);
  var wire = [];
  [[-6.2, 1.9, 2.4, .4], [-5.3, .9, 3.6, .3]].forEach(function (p) {
    var w = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(p[3], p[3], p[3])), new THREE.LineBasicMaterial({ color: 0xffc996, transparent: true, opacity: .55 }));
    w.position.set(p[0], p[1], p[2]); w.userData.y = p[1]; world.add(w); wire.push(w);
  });

  /* ---------- anillos ---------- */
  function ring(r, o, x, z) {
    var m = new THREE.Mesh(new THREE.RingGeometry(r, r + .025, 128), glowMat(o)); m.rotation.x = -Math.PI / 2; m.position.set(x || 0, .015, z || 0); world.add(m); return m;
  }
  ring(6.4, .07); ring(8.9, .045);
  var radar = [ring(1.4, .4, byKey.com.x, byKey.com.z), ring(1.4, .4, byKey.ceo.x, byKey.ceo.z), ring(1.4, .4, byKey.cli.x, byKey.cli.z)];
  var shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.ShadowMaterial({ opacity: .32 }));
  shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.receiveShadow = true; world.add(shadowFloor);

  /* ---------- pulsos ---------- */
  var pulseMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffb36b, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  var pulses = [], hubFlash = 0;
  var packetGeo = new THREE.BoxGeometry(.16, .16, .16);
  function spawn(l) {
    var s = new THREE.Sprite(pulseMat.clone()); s.scale.set(.6, .6, 1); world.add(s);
    var p = { s: s, l: l, t: 0, v: 1.1 / (l.len / 3.8) * (.85 + Math.random() * .3) };
    if (l.dir === 2) p.rev = Math.random() < .5;
    if ((l.dir === -1 || p.rev || l.dir === 1) && Math.random() < .35) { p.box = mesh(packetGeo, M.orange); world.add(p.box); }
    pulses.push(p);
  }

  /* ---------- interacción ---------- */
  var ray = new THREE.Raycaster(), mouse = new THREE.Vector2(9, 9), par = { x: 0, y: 0, tx: 0, ty: 0 }, hovered = null;
  canvas.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width * 2 - 1; mouse.y = -(e.clientY - r.top) / r.height * 2 + 1;
    par.tx = mouse.x; par.ty = mouse.y;
    var d = view.drag;
    if (d && d.id === e.pointerId) {
      var dx = e.clientX - d.x, dy = e.clientY - d.y;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) view.moved = true;
      if (view.moved) {
        var now = performance.now(), ny = d.yaw + dx * .008;
        view.vYaw = (ny - view.yaw) / Math.max(.016, (now - d.t) / 1000); d.t = now;
        view.yaw = ny;
        if (e.pointerType === 'mouse') { view.pitch = Math.max(.17, Math.min(1.3, d.pitch - dy * .005)); applyCam(); }
        canvas.style.cursor = 'grabbing';
      }
    }
    if (reduce || !running) { aplicarGiro(); render(); }
  });
  // girar: arrastrar con el mouse (de costado gira, para arriba o abajo inclina) o con el dedo de costado
  canvas.addEventListener('pointerdown', function (e) {
    view.drag = { id: e.pointerId, x: e.clientX, y: e.clientY, yaw: view.yaw, pitch: view.pitch, t: performance.now() };
    view.moved = false; view.vYaw = 0; view.reset = false;
    try { canvas.setPointerCapture(e.pointerId); } catch (er) {}
  });
  function soltar(e) {
    if (!view.drag || view.drag.id !== e.pointerId) return;
    view.drag = null; canvas.style.cursor = '';
    if (!view.moved) view.vYaw = 0;
    view.vYaw = Math.max(-4, Math.min(4, view.vYaw));
    try { canvas.releasePointerCapture(e.pointerId); } catch (er) {}
  }
  canvas.addEventListener('pointerup', soltar);
  canvas.addEventListener('pointercancel', soltar);
  function aplicarGiro() { world.rotation.y = view.yaw + (view.drag ? 0 : par.x * .07); }
  // botones para girar y volver a la vista inicial
  var rot = document.createElement('div'); rot.className = 'sc-eco-rot';
  rot.innerHTML = '<button type="button" data-r="-1" aria-label="Girar a la izquierda">⟲</button><button type="button" data-r="0" aria-label="Volver a la vista inicial">Vista inicial</button><button type="button" data-r="1" aria-label="Girar a la derecha">⟳</button>';
  stage.appendChild(rot);
  rot.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    var r = +b.dataset.r;
    if (r === 0) view.reset = true; else { view.reset = false; view.yaw += r * Math.PI / 4 * (reduce || !running ? 1 : 0); if (!reduce && running) view.vYaw = r * 2.4; }
    if (reduce || !running) { if (r === 0) { view.yaw = 0; view.pitch = PITCH0; applyCam(); } aplicarGiro(); render(); }
  });
  canvas.addEventListener('pointerleave', function () { mouse.set(9, 9); par.tx = par.ty = 0; });
  // clic o toque en una base: abre su ficha y muestra solo sus pases
  canvas.addEventListener('click', function (e) {
    if (view.moved) { view.moved = false; return; }
    var r = canvas.getBoundingClientRect();
    var m = new THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -(e.clientY - r.top) / r.height * 2 + 1);
    cam.updateMatrixWorld(); world.updateMatrixWorld();
    ray.setFromCamera(m, cam);
    var hit = ray.intersectObjects(pickables, false)[0];
    seleccionar(hit ? hit.object.userData.node : null);
  });
  var pickables = []; NODES.forEach(function (n) { n.group.traverse(function (o) { if (o.isMesh && o.material.type !== 'MeshBasicMaterial') pickables.push(o); }); });

  /* ---------- tamaño ---------- */
  var W = 1, Hh = 1;
  function resize() {
    var r = stage.getBoundingClientRect(); W = Math.max(1, r.width); Hh = Math.max(1, r.height);
    renderer.setSize(W, Hh, false);
    // en pantallas angostas los nombres largos se pisan: van los cortos
    NODES.forEach(function (n) { n.el.textContent = W < 560 ? n.corto : n.label; n.medio = 0; });
    var a = W / Hh, vh = a < 1 ? 11.8 / a : 10.4;
    camBase.w = vh * a; camBase.h = vh;
    encuadre(true);
  }
  // con la ficha abierta (en pantallas anchas) la escena se corre a la izquierda para que no quede tapada
  // cw = ancho que ocupa la ficha; la escena se achica y se centra en el espacio que queda libre
  var camBase = { w: 2, h: 2 }, cwA = 0;
  function encuadre(ya, dt) {
    var cw = sel && W > 700 ? card.offsetWidth + 28 : 0;
    cwA = ya ? cw : cwA + (cw - cwA) * Math.min(1, dt * 6);
    var z = Math.min(1.4, W / Math.max(1, W - cwA)), F = camBase.w * z;
    cam.left = -((W - cwA) / 2) * (F / W); cam.right = cam.left + F;
    cam.top = camBase.h / 2 * z; cam.bottom = -camBase.h / 2 * z;
    cam.updateProjectionMatrix();
  }
  window.addEventListener('resize', function () { resize(); if (reduce || !running) render(); });

  /* ---------- animación ---------- */
  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function outBack(p) { var c = 1.4; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); }
  var T = reduce ? 30 : 0, last = performance.now(), running = true, raf = 0, v3 = new THREE.Vector3();

  function update(dt) {
    var intro = T;
    // entrada de las bases
    var hp = clamp(intro / .9); hub.position.y = (1 - outBack(hp)) * 6;
    NODES.forEach(function (n) {
      var p = clamp((intro - n.delay) / .85);
      n.hover += ((hovered === n || n.sel || (!hovered && n.focus) ? 1 : 0) - n.hover) * Math.min(1, dt * 10);
      n.group.position.y = (1 - outBack(p)) * 6 + n.hover * .2;
      n.group.userData.rim.material.opacity = .45 + n.hover * .5;
      n.group.userData.halo.material.opacity = .1 + n.hover * .18;
      if (n.obj.userData.bob) n.obj.userData.bob.position.y = n.obj.userData.bobY + Math.sin(T * 2.2 + n.delay * 9) * .08;
      var ag = n.obj.userData.agent; if (ag) { n.ping = Math.max(0, (n.ping || 0) - dt * 1.5); ag.position.y = Math.abs(Math.sin(T * 6)) * .12 * n.ping; ag.userData.head.rotation.y = Math.sin(T * 1.3 + n.delay * 7) * .4; }
      if (n.obj.userData.leds) n.obj.userData.leds.forEach(function (l) { l.material.opacity = .35 + .65 * (Math.sin(T * 3 + l.userData.ph) > 0 ? 1 : .2); });
    });
    arcs.forEach(function (a, k) {
      var p = clamp((intro - 2.0 - k * .07) / .9), e = 1 - Math.pow(1 - p, 3), cnt = Math.floor(a.n * e / 3) * 3;
      a.tube.geometry.setDrawRange(0, cnt); a.halo.geometry.setDrawRange(0, cnt);
      var lit = (hovered && (hovered === a.from || hovered === a.to)) || a.focus || (sel && (sel === a.from || sel === a.to)) ? 1 : 0;
      a.tube.material.opacity = (hovered && !lit ? .14 : .36) + lit * .55; a.halo.material.opacity = .08 + lit * .12;
      if (intro > 3.2 && !reduce) { a.next -= dt; if (a.next <= 0) { spawnArc(a); a.next = 2.2 + Math.random() * 3.8; } }
    });
    if (intro > 3.4 && !reduce) director(dt);
    for (var q = arcPulses.length - 1; q >= 0; q--) {
      var ap = arcPulses[q]; ap.t += dt * ap.v;
      ap.a.c.getPoint(clamp(ap.rev ? 1 - ap.t : ap.t), ap.s.position);
      ap.s.material.opacity = Math.min(1, ap.t * 6, (1 - ap.t) * 6);
      if (ap.t >= 1) { (ap.rev ? ap.a.from : ap.a.to).ping = 1; world.remove(ap.s); ap.s.material.dispose(); arcPulses.splice(q, 1); }
    }
    links.forEach(function (l) {
      var p = clamp((intro - 1.35) / .8); l.g.scale.x = Math.max(.0001, 1 - Math.pow(1 - p, 3));
      var lit = (hovered && (hovered === l.from || hovered === l.to)) ? 1 : 0;
      l.core.material.opacity = .45 + lit * .5;
      if (intro > 2.1 && l.dir !== 0 && !reduce) { l.next -= dt; if (l.next <= 0) { spawn(l); l.next = 1.4 + Math.random() * 2.6; } }
    });
    // centro
    core.rotation.x += dt * .5; core.rotation.y += dt * .7;
    core.position.y = TOP + 1.0 + Math.sin(T * 1.6) * .08;
    hubFlash = Math.max(0, hubFlash - dt * 2.2);
    coreMat.emissiveIntensity = .55 + hubFlash * .9;
    hubLight.intensity = 1.0 + hubFlash * 1.4 + Math.sin(T * 2) * .1;
    plateGlow.material.opacity = .5 + hubFlash * .3;
    beam.material.opacity = .16 + hubFlash * .14;
    motes.rotation.y += dt * .25;
    // tráfico
    for (var i = 0; i < N; i++) {
      var s = streaks[i]; if (!reduce) s.t += dt * s.v; if (s.t > 1) s.t -= 1;
      v3.copy(s.s).lerp(s.e, s.t * s.t);
      dotPos[i * 3] = v3.x; dotPos[i * 3 + 1] = v3.y; dotPos[i * 3 + 2] = v3.z;
    }
    dg.attributes.position.needsUpdate = true;
    wire.forEach(function (w, k) { w.rotation.x += dt * .3; w.rotation.y += dt * (.4 + k * .2); w.position.y = w.userData.y + Math.sin(T * 1.2 + k) * .15; });
    radar.forEach(function (r, k) { var q = ((T * .45 + k * .5) % 1); r.scale.setScalar(1 + q * .9); r.material.opacity = .35 * (1 - q); });
    // pulsos
    for (var j = pulses.length - 1; j >= 0; j--) {
      var p = pulses[j]; p.t += dt * p.v;
      var rev = p.l.dir === -1 || p.rev, u = rev ? 1 - p.t : p.t;
      v3.copy(p.l.A).lerp(p.l.B, clamp(u)); v3.y = .16;
      p.s.position.copy(v3);
      p.s.material.opacity = Math.min(1, p.t * 6, (1 - p.t) * 6);
      if (p.box) { p.box.position.set(v3.x, .22 + Math.abs(Math.sin(p.t * 9)) * .05, v3.z); p.box.rotation.y += dt * 3; }
      if (p.t >= 1) {
        if ((rev ? p.l.from : p.l.to) === H) hubFlash = 1;
        var dest = rev ? p.l.from : p.l.to; if (dest !== H) dest.ping = 1;
        world.remove(p.s); p.s.material.dispose(); if (p.box) world.remove(p.box); pulses.splice(j, 1);
      }
    }
    // camioneta
    // parallax
    par.x += (par.tx - par.x) * Math.min(1, dt * 3); par.y += (par.ty - par.y) * Math.min(1, dt * 3);
    if (!view.drag) { view.yaw += view.vYaw * dt; view.vYaw *= Math.exp(-dt * 2.6); if (Math.abs(view.vYaw) < .01) view.vYaw = 0; }
    if (view.reset) {
      var y0 = Math.atan2(Math.sin(view.yaw), Math.cos(view.yaw));
      view.yaw = y0 + (0 - y0) * Math.min(1, dt * 5); view.pitch += (PITCH0 - view.pitch) * Math.min(1, dt * 5); applyCam();
      if (Math.abs(view.yaw) < .002 && Math.abs(view.pitch - PITCH0) < .002) { view.yaw = 0; view.pitch = PITCH0; applyCam(); view.reset = false; }
    }
    aplicarGiro(); world.position.y = par.y * .15;
    encuadre(false, dt);
  }

  function placeLabels() {
    var show = T > 1.2, touch = noHover;
    NODES.forEach(function (n) {
      v3.set(n.x, n.group.position.y + 2.55, n.z).applyMatrix4(world.matrixWorld).project(cam);
      var px = (v3.x * .5 + .5) * W, py = (-v3.y * .5 + .5) * Hh;
      var c = new THREE.Vector3(n.x, n.group.position.y, n.z).applyMatrix4(world.matrixWorld).project(cam);
      var cx = (c.x * .5 + .5) * W;
      // que el rótulo no se salga del recuadro
      if (!n.medio) n.medio = n.el.offsetWidth / 2;
      cx = Math.min(W - n.medio - 6, Math.max(n.medio + 6, cx));
      n.el.style.transform = 'translate(' + Math.round(cx) + 'px,' + Math.round(py) + 'px) translate(-50%, -100%)';
      var f = hovered ? hovered === n || n.sel : n.focus || n.sel;
      n.el.style.opacity = show && (touch || f) ? 1 : 0;
      n.el.classList.toggle('on', !!f);
    });
  }

  function placeCap() {
    if (!bigS.visible) { cap.style.opacity = 0; return; }
    v3.copy(bigS.position).applyMatrix4(world.matrixWorld).project(cam);
    cap.style.transform = 'translate(' + Math.round((v3.x * .5 + .5) * W) + 'px,' + Math.round((-v3.y * .5 + .5) * Hh - 34) + 'px) translateX(-50%)';
    cap.style.opacity = 1;
  }
  function pick() {
    if (mouse.x > 2) { hovered = null; canvas.style.cursor = ''; return; }
    ray.setFromCamera(mouse, cam);
    var hit = ray.intersectObjects(pickables, false)[0];
    hovered = hit ? hit.object.userData.node : null;
    canvas.style.cursor = hovered ? 'pointer' : '';
  }

  function render() { cam.updateMatrixWorld(); world.updateMatrixWorld(); pick(); placeLabels(); placeCap(); renderer.render(scene, cam); }

  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    T += dt; update(dt); render();
    raf = running ? requestAnimationFrame(frame) : 0;
  }

  resize();
  if (document.fonts) document.fonts.ready.then(function () { NODES.forEach(function (n) { n.medio = 0; }); });
  function animar() {
    raf = requestAnimationFrame(frame);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        running = es[0].isIntersecting && !document.hidden;
        if (running && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }).observe(stage);
    }
    document.addEventListener('visibilitychange', function () {
      running = !document.hidden;
      if (running && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
    });
  }
  if (reduce) {
    // con "reducir movimiento" la escena queda quieta, pero se puede reproducir a pedido
    update(0); render();
    var play = document.createElement('button'); play.type = 'button'; play.className = 'sc-eco-play';
    play.innerHTML = '<span aria-hidden="true">▶</span> Ver cómo trabajan los agentes';
    startAnim = function () { if (!reduce) return; reduce = false; play.remove(); last = performance.now(); animar(); };
    play.addEventListener('click', startAnim);
    stage.appendChild(play);
  } else animar();
})();
