/* Portada 3D del caso "ecosistema": bases isométricas conectadas a un centro.
   Three.js r128 (assets/js/three.r128.min.js). Marcado: #sc-eco-stage > canvas#sc-eco-scene + #sc-eco-labels. */
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
  var target = new THREE.Vector3(0.5, 0.4, 0.5);
  cam.position.set(14, 12.5, 14).add(target);
  cam.lookAt(target);

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

  var webTex = tex(512, 320, function (x, w, h) {
    x.fillStyle = '#f3f5f7'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, 44);
    x.fillStyle = '#F2801E'; rr(x, 22, 13, 18, 18, 5); x.fill();
    x.fillStyle = '#1b232c'; x.font = '700 17px ' + SANS; x.fillText('Studio', 48, 28);
    x.fillStyle = '#c4cbd2'; [300, 350, 400].forEach(function (X) { rr(x, X, 18, 38, 8, 4); x.fill(); });
    x.fillStyle = '#F2801E'; rr(x, 448, 12, 46, 20, 10); x.fill();
    var g = x.createLinearGradient(0, 60, w, 160); g.addColorStop(0, '#1b232c'); g.addColorStop(1, '#2b3743');
    x.fillStyle = g; rr(x, 20, 60, w - 40, 112, 12); x.fill();
    x.fillStyle = '#ffffff'; rr(x, 40, 86, 220, 16, 8); x.fill(); rr(x, 40, 110, 160, 16, 8); x.fill();
    x.fillStyle = '#F2801E'; rr(x, 40, 138, 96, 22, 11); x.fill();
    x.fillStyle = '#F2801E'; x.globalAlpha = .85; x.beginPath(); x.arc(400, 116, 38, 0, 7); x.fill(); x.globalAlpha = 1;
    for (var i = 0; i < 3; i++) {
      var X = 20 + i * 160;
      x.fillStyle = '#ffffff'; rr(x, X, 186, 152, 116, 10); x.fill();
      x.fillStyle = i === 1 ? '#fde3cc' : '#e3e8ed'; rr(x, X + 10, 196, 132, 56, 7); x.fill();
      x.fillStyle = '#c4cbd2'; rr(x, X + 10, 262, 100, 9, 4); x.fill(); rr(x, X + 10, 278, 70, 9, 4); x.fill();
    }
  });
  var adTex = tex(512, 320, function (x, w, h) {
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#F2801E'; x.beginPath(); x.arc(34, 30, 14, 0, 7); x.fill();
    x.fillStyle = '#1b232c'; x.font = '700 18px ' + SANS; x.fillText('Studio Complex', 58, 28);
    x.fillStyle = '#8a939c'; x.font = '500 13px ' + SANS; x.fillText('Patrocinado', 58, 45);
    var g = x.createLinearGradient(0, 62, 0, 228); g.addColorStop(0, '#ffb26b'); g.addColorStop(1, '#F2801E');
    x.fillStyle = g; x.fillRect(0, 62, w, 166);
    x.fillStyle = 'rgba(255,255,255,.92)'; x.font = '800 64px ' + SANS; x.fillText('-30%', 28, 168);
    x.fillStyle = '#1b232c'; rr(x, 330, 90, 150, 110, 14); x.fill();
    x.fillStyle = '#F2801E'; rr(x, 346, 106, 118, 58, 8); x.fill();
    x.fillStyle = '#ffffff'; rr(x, 346, 174, 80, 10, 5); x.fill();
    x.fillStyle = '#1b232c'; x.font = '700 19px ' + SANS; x.fillText('Tu tienda online lista', 24, 266);
    x.fillStyle = '#8a939c'; x.font = '500 14px ' + SANS; x.fillText('studiocomplex.com.ar', 24, 292);
    x.fillStyle = '#F2801E'; rr(x, 372, 250, 116, 46, 23); x.fill();
    x.fillStyle = '#ffffff'; x.font = '700 17px ' + SANS; x.fillText('Ver más', 398, 279);
  });
  var chatTex = tex(256, 512, function (x, w, h) {
    x.fillStyle = '#0b141a'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#1f2c34'; x.fillRect(0, 0, w, 64);
    x.fillStyle = '#25D366'; x.beginPath(); x.arc(32, 34, 16, 0, 7); x.fill();
    x.fillStyle = '#e9edef'; x.font = '700 15px ' + SANS; x.fillText('Lucía', 58, 30);
    x.fillStyle = '#8696a0'; x.font = '500 11px ' + SANS; x.fillText('en línea', 58, 47);
    var b = [[0, 92, 150, 46], [1, 152, 170, 64], [0, 230, 120, 40], [1, 284, 180, 46], [0, 344, 160, 64], [1, 422, 110, 40]];
    b.forEach(function (q) {
      var right = q[0] === 1, W = q[2], X = right ? w - W - 14 : 14;
      x.fillStyle = right ? '#005c4b' : '#202c33'; rr(x, X, q[1], W, q[3], 10); x.fill();
      x.fillStyle = right ? '#bfe9dc' : '#9fb0b9';
      rr(x, X + 12, q[1] + 13, W - 30, 8, 4); x.fill();
      if (q[3] > 44) { rr(x, X + 12, q[1] + 29, W - 60, 8, 4); x.fill(); }
    });
  });
  var kanbanTex = tex(512, 336, function (x, w, h) {
    x.fillStyle = '#10151c'; x.fillRect(0, 0, w, h);
    x.fillStyle = '#1b232c'; x.fillRect(0, 0, w, 40);
    x.fillStyle = '#F2801E'; rr(x, 16, 13, 14, 14, 4); x.fill();
    x.fillStyle = '#e8ecef'; x.font = '700 15px ' + SANS; x.fillText('CRM · Oportunidades', 40, 26);
    var cols = ['NUEVO', 'EN CURSO', 'GANADO'], counts = [3, 2, 2];
    cols.forEach(function (c, i) {
      var X = 14 + i * 166;
      x.fillStyle = '#151d26'; rr(x, X, 52, 152, 272, 10); x.fill();
      x.fillStyle = i === 2 ? '#F2801E' : '#8a939c'; x.font = '700 12px ' + SANS; x.fillText(c, X + 12, 74);
      for (var k = 0; k < counts[i]; k++) {
        var Y = 88 + k * 76, hot = i === 2 && k === 0;
        x.fillStyle = hot ? '#F2801E' : '#243040'; rr(x, X + 10, Y, 132, 64, 8); x.fill();
        x.fillStyle = hot ? '#ffffff' : '#c2cad2'; rr(x, X + 22, Y + 14, 84, 9, 4); x.fill();
        x.fillStyle = hot ? '#ffe2c8' : '#6d7a87'; rr(x, X + 22, Y + 32, 56, 8, 4); x.fill();
        x.fillStyle = hot ? '#ffffff' : '#8a939c'; x.beginPath(); x.arc(X + 124, Y + 46, 7, 0, 7); x.fill();
      }
    });
  });
  var awningTex = tex(256, 64, function (x, w, h) {
    for (var i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#f6f2ee' : '#F2801E'; x.fillRect(i * 32, 0, 32, h); }
  });

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

  /* ---------- objetos de cada base ---------- */
  function oBillboard() {
    var g = new THREE.Group();
    add(g, box(.08, 1.0, .08, M.light), -.55, .5, 0); add(g, box(.08, 1.0, .08, M.light), .55, .5, 0);
    add(g, screen(1.55, .97, adTex), 0, 1.3, .05);
    g.rotation.y = Math.PI / 4;
    return g;
  }
  function oMonitor() {
    var g = new THREE.Group();
    add(g, box(.72, .05, .42, M.light), 0, .025, 0);
    add(g, box(.1, .6, .08, M.light), 0, .32, -.06);
    add(g, screen(1.62, 1.01, webTex), 0, 1.06, 0);
    g.rotation.y = Math.PI / 4;
    return g;
  }
  function oStore() {
    var g = new THREE.Group();
    add(g, box(1.42, .76, 1.0, M.white), 0, .38, 0);
    add(g, box(1.58, .12, 1.16, M.dark), 0, .82, 0);
    add(g, box(1.2, .16, .04, M.dark), 0, .68, .52);
    add(g, box(.3, .5, .03, M.dark), -.4, .25, .51);
    add(g, box(.62, .32, .02, M.warm), .22, .34, .51);
    var aw = new THREE.Mesh(new THREE.PlaneGeometry(1.34, .44), new THREE.MeshStandardMaterial({ map: awningTex, side: THREE.DoubleSide, roughness: .7 }));
    aw.castShadow = true; aw.rotation.x = -1.0; add(g, aw, 0, .6, .69);
    var bag = add(g, box(.24, .28, .12, M.orange), .62, .14, .78);
    var handle = new THREE.Mesh(new THREE.TorusGeometry(.07, .015, 6, 16, Math.PI), M.dark); add(bag, handle, 0, .14, 0);
    var bag2 = add(g, box(.2, .24, .1, M.white), .36, .12, .86); add(bag2, new THREE.Mesh(new THREE.TorusGeometry(.06, .014, 6, 16, Math.PI), M.dark), 0, .12, 0);
    return g;
  }
  function oPhone() {
    var g = new THREE.Group();
    add(g, box(.52, .07, .36, M.light), 0, .035, 0);
    var tilt = add(g, new THREE.Group(), 0, .07, 0); tilt.rotation.x = -.14;
    add(tilt, box(.76, 1.4, .09, M.dark), 0, .72, 0);
    add(tilt, new THREE.Mesh(new THREE.PlaneGeometry(.68, 1.3), new THREE.MeshBasicMaterial({ map: chatTex })), 0, .72, .047);
    var bubble = add(g, new THREE.Group(), .55, 1.75, .1);
    add(bubble, mesh(rbox(.5, .1, .34, .12), std(0x25D366, { emissive: 0x25D366, emissiveIntensity: .25 }))).rotation.x = Math.PI / 2;
    g.userData.bob = bubble;
    g.rotation.y = Math.PI / 4;
    return g;
  }
  function oKanban() {
    var g = new THREE.Group();
    add(g, box(.07, 1.05, .07, M.light), -.6, .52, -.05).rotation.x = .08;
    add(g, box(.07, 1.05, .07, M.light), .6, .52, -.05).rotation.x = .08;
    add(g, screen(1.62, 1.06, kanbanTex), 0, 1.2, .04).rotation.x = -.08;
    g.rotation.y = Math.PI / 4;
    return g;
  }
  function oServers() {
    var g = new THREE.Group(), leds = [];
    [-.34, .34].forEach(function (X) {
      add(g, box(.58, 1.28, .64, M.white), X, .64, 0);
      add(g, box(.48, 1.14, .02, M.dark), X, .64, .325);
      for (var r = 0; r < 7; r++) {
        add(g, box(.4, .02, .01, std(0x2c3743)), X, .2 + r * .15, .337);
        var led = add(g, new THREE.Mesh(new THREE.BoxGeometry(.05, .03, .01), new THREE.MeshBasicMaterial({ color: r % 3 ? 0x25D366 : ORANGE, transparent: true })), X + .15, .25 + r * .15, .338);
        led.userData.ph = Math.random() * 6; leds.push(led);
      }
    });
    g.userData.leds = leds;
    return g;
  }
  function oHouse() {
    var g = new THREE.Group();
    add(g, mesh(rbox(1.78, .05, 1.78, .2), M.grass), 0, 0, 0);
    add(g, box(1.0, .62, .82, M.white), -.12, .36, -.12);
    var s = new THREE.Shape(); s.moveTo(-.62, 0); s.lineTo(.62, 0); s.lineTo(0, .48); s.closePath();
    var rg = new THREE.ExtrudeGeometry(s, { depth: .98, bevelEnabled: false }); rg.translate(0, 0, -.49);
    var roof = add(g, mesh(rg, M.dark), -.12, .67, -.12); roof.rotation.y = Math.PI / 2;
    add(g, box(.2, .34, .02, M.dark), .2, .22, .3);
    add(g, box(.22, .18, .02, M.warm), -.25, .42, .3);
    add(g, box(.02, .18, .22, M.warm), .39, .42, -.3);
    [[.62, .62], [-.66, .55], [.58, -.66]].forEach(function (p, i) {
      add(g, box(.06, .26, .06, M.trunk), p[0], .15, p[1]);
      add(g, mesh(new THREE.IcosahedronGeometry(.2 + i * .03, 0), M.tree), p[0], .42 + i * .02, p[1]);
    });
    for (var k = 0; k < 3; k++) add(g, box(.18, .02, .12, M.light), .2 + k * .0, .03, .45 + k * .16);
    return g;
  }
  function oVan() {
    var g = new THREE.Group();
    add(g, box(.48, .46, .86, M.white), 0, .33, .1);
    add(g, box(.46, .34, .3, M.white), 0, .27, -.48);
    add(g, box(.47, .14, .02, M.dark), 0, .38, -.635);
    add(g, box(.49, .05, .7, M.orange), 0, .3, .12);
    [[-.25, .3], [.25, .3], [-.25, -.44], [.25, -.44]].forEach(function (p) {
      var w = add(g, mesh(new THREE.CylinderGeometry(.1, .1, .06, 14), M.dark), p[0], .1, p[1]); w.rotation.z = Math.PI / 2;
    });
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
    { key: 'ads', label: 'Anuncios', x: -3.8, z: 0, make: oBillboard },
    { key: 'web', label: 'Sitio web', x: -2.7, z: -2.8, make: oMonitor },
    { key: 'store', label: 'Tienda online', x: 0, z: -3.8, make: oStore },
    { key: 'wa', label: 'WhatsApp', x: 2.7, z: -2.8, make: oPhone },
    { key: 'crm', label: 'CRM', x: 3.8, z: 0, make: oKanban },
    { key: 'auto', label: 'Automatizaciones', x: 0, z: 3.8, make: oServers },
    { key: 'client', label: 'Cliente', x: 2.8, z: 2.9, make: oHouse }
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
  ['ads', 'web', 'store', 'wa'].forEach(function (k) { link(H, byKey[k], -1); });
  link(H, byKey.crm, 1); link(H, byKey.auto, 1);
  link(byKey.crm, byKey.client, 1);
  link(byKey.auto, byKey.client, 0);

  /* ---------- tráfico que entra a los anuncios ---------- */
  var adsTop = new THREE.Vector3(byKey.ads.x, 1.25, byKey.ads.z);
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

  /* ---------- anillos, ruta y camioneta ---------- */
  function ring(r, o, x, z) {
    var m = new THREE.Mesh(new THREE.RingGeometry(r, r + .025, 128), glowMat(o)); m.rotation.x = -Math.PI / 2; m.position.set(x || 0, .015, z || 0); world.add(m); return m;
  }
  ring(6.4, .07); ring(8.9, .045);
  var radar = [ring(1.4, .4, byKey.ads.x, byKey.ads.z), ring(1.4, .4, byKey.client.x, byKey.client.z)];
  var shadowFloor = new THREE.Mesh(new THREE.PlaneGeometry(70, 70), new THREE.ShadowMaterial({ opacity: .32 }));
  shadowFloor.rotation.x = -Math.PI / 2; shadowFloor.receiveShadow = true; world.add(shadowFloor);
  var ROAD_X = 5.75;
  add(world, box(1.25, .04, 44, M.road), ROAD_X, .02, 0);
  for (var d = -21; d < 21; d += 1.1) add(world, new THREE.Mesh(new THREE.BoxGeometry(.06, .01, .45), new THREE.MeshBasicMaterial({ color: 0x6b7681 })), ROAD_X, .045, d);
  add(world, box(1.6, .03, .5, M.road), 4.6, .015, byKey.client.z + .35);
  var van = oVan(); van.position.set(ROAD_X - .28, .04, 12); world.add(van);

  /* ---------- pulsos ---------- */
  var pulseMat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffb36b, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  var pulses = [], hubFlash = 0;
  var packetGeo = new THREE.BoxGeometry(.16, .16, .16);
  function spawn(l) {
    var s = new THREE.Sprite(pulseMat.clone()); s.scale.set(.6, .6, 1); world.add(s);
    var p = { s: s, l: l, t: 0, v: 1.1 / (l.len / 3.8) * (.85 + Math.random() * .3) };
    if (l.dir === -1 && Math.random() < .35) { p.box = mesh(packetGeo, M.orange); world.add(p.box); }
    pulses.push(p);
  }

  /* ---------- interacción ---------- */
  var ray = new THREE.Raycaster(), mouse = new THREE.Vector2(9, 9), par = { x: 0, y: 0, tx: 0, ty: 0 }, hovered = null;
  canvas.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) / r.width * 2 - 1; mouse.y = -(e.clientY - r.top) / r.height * 2 + 1;
    par.tx = mouse.x; par.ty = mouse.y;
    if (reduce) render();
  });
  canvas.addEventListener('pointerleave', function () { mouse.set(9, 9); par.tx = par.ty = 0; });
  var pickables = []; NODES.forEach(function (n) { n.group.traverse(function (o) { if (o.isMesh && o.material.type !== 'MeshBasicMaterial') pickables.push(o); }); });

  /* ---------- tamaño ---------- */
  var W = 1, Hh = 1;
  function resize() {
    var r = stage.getBoundingClientRect(); W = Math.max(1, r.width); Hh = Math.max(1, r.height);
    renderer.setSize(W, Hh, false);
    var a = W / Hh, view = a < 1 ? 12.6 / a : 11.2;
    cam.left = -view * a / 2; cam.right = view * a / 2; cam.top = view / 2; cam.bottom = -view / 2;
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
      n.hover += ((hovered === n ? 1 : 0) - n.hover) * Math.min(1, dt * 10);
      n.group.position.y = (1 - outBack(p)) * 6 + n.hover * .2;
      n.group.userData.rim.material.opacity = .45 + n.hover * .5;
      n.group.userData.halo.material.opacity = .1 + n.hover * .18;
      if (n.obj.userData.bob) n.obj.userData.bob.position.y = 1.75 + Math.sin(T * 2.2) * .08;
      if (n.obj.userData.leds) n.obj.userData.leds.forEach(function (l) { l.material.opacity = .35 + .65 * (Math.sin(T * 3 + l.userData.ph) > 0 ? 1 : .2); });
    });
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
      var u = p.l.dir === -1 ? 1 - p.t : p.t;
      v3.copy(p.l.A).lerp(p.l.B, clamp(u)); v3.y = .16;
      p.s.position.copy(v3);
      p.s.material.opacity = Math.min(1, p.t * 6, (1 - p.t) * 6);
      if (p.box) { p.box.position.set(v3.x, .22 + Math.abs(Math.sin(p.t * 9)) * .05, v3.z); p.box.rotation.y += dt * 3; }
      if (p.t >= 1) {
        if (p.l.dir === -1) hubFlash = 1;
        world.remove(p.s); p.s.material.dispose(); if (p.box) world.remove(p.box); pulses.splice(j, 1);
      }
    }
    // camioneta
    if (!reduce) { van.position.z -= dt * 1.6; if (van.position.z < -13) van.position.z = 13; }
    // parallax
    par.x += (par.tx - par.x) * Math.min(1, dt * 3); par.y += (par.ty - par.y) * Math.min(1, dt * 3);
    world.rotation.y = par.x * .07; world.position.y = par.y * .15;
  }

  function placeLabels() {
    var show = T > 1.2, touch = noHover;
    NODES.forEach(function (n) {
      v3.set(n.x + n.size * .5, n.group.position.y, n.z + n.size * .5).applyMatrix4(world.matrixWorld).project(cam);
      var px = (v3.x * .5 + .5) * W, py = (-v3.y * .5 + .5) * Hh;
      var c = new THREE.Vector3(n.x, n.group.position.y, n.z).applyMatrix4(world.matrixWorld).project(cam);
      var cx = (c.x * .5 + .5) * W;
      n.el.style.transform = 'translate(' + Math.round(cx) + 'px,' + Math.round(py + 6) + 'px) translateX(-50%)';
      n.el.style.opacity = show && (touch || hovered === n) ? 1 : 0;
      n.el.classList.toggle('on', hovered === n);
    });
  }

  function pick() {
    if (mouse.x > 2) { hovered = null; canvas.style.cursor = ''; return; }
    ray.setFromCamera(mouse, cam);
    var hit = ray.intersectObjects(pickables, false)[0];
    hovered = hit ? hit.object.userData.node : null;
    canvas.style.cursor = hovered ? 'pointer' : '';
  }

  function render() { cam.updateMatrixWorld(); world.updateMatrixWorld(); pick(); placeLabels(); renderer.render(scene, cam); }

  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    T += dt; update(dt); render();
    raf = running ? requestAnimationFrame(frame) : 0;
  }

  resize();
  if (reduce) { update(0); render(); }
  else {
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
})();
