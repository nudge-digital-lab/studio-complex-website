"""Genera las páginas de búsquedas laborales a partir de vacante-ejecutivo-comercial.html (molde) y de VACANTES.
Uso: python3 tools/vacantes.py   (desde la raíz del sitio)"""
import re, urllib.parse
MOLDE = open('vacante-ejecutivo-comercial.html').read()
WA = 'https://wa.me/5491153362945?text='
BENEFICIOS = """<h2>Lo que ofrecemos</h2>
<ul>
<li><b>100% remoto y con horario flexible:</b> trabajás desde donde quieras, por objetivos.</li>
<li><b>Formación continua</b> en inteligencia artificial y en cada uno de nuestros servicios.</li>
<li><b>Herramientas de IA y CRM propio</b> para trabajar más rápido y mejor.</li>
<li><b>Crecimiento en la agencia,</b> con la posibilidad de liderar tu área.</li>
</ul>"""
VACANTES = [
 dict(slug='ecommerce-advisor', titulo='eCommerce Advisor', eyebrow='Búsqueda abierta', area='Estrategia',
  bajada='Buscamos un perfil estratégico y analítico, capaz de diagnosticar la performance de una tienda online y orientar sus decisiones de crecimiento.',
  meta=['100% remoto','Horario flexible','Por objetivos'],
  intro='En Studio Complex armamos y hacemos crecer tiendas online. Sumamos a alguien con mirada integral de negocio que analice cada cuenta (adquisición, contenido, anuncios y la tienda en sí) y diga qué hacer para vender más, sin meterse en la ejecución operativa. Usamos inteligencia artificial en el día a día, así que buscamos curiosidad genuina por integrarla.',
  hacer=['Detectar oportunidades de mejora en el embudo: sesiones, conversión, ticket promedio y facturación.','Asesorar a los clientes en sus decisiones de crecimiento comercial.','Analizar el rendimiento de las campañas y de cada canal de adquisición.','Recomendar mejoras en creatividades, promociones, remarketing, la web y las automatizaciones.','Coordinar con los equipos de diseño, pauta y desarrollo.','Documentar los hallazgos y oportunidades de cada cuenta.','Construir relaciones de confianza a largo plazo con los clientes.'],
  buscamos=['Experiencia en eCommerce, marketing digital o roles de crecimiento con foco en resultados.','Buen manejo de Meta Ads, Google Ads y analítica (GA4 y similares).','Capacidad para convertir datos en conclusiones claras y accionables.','Entendimiento del embudo de ventas y del rol del contenido orgánico y pago.','Muy buena comunicación para presentar diagnósticos y recomendaciones.','Interés real en trabajar con agentes de IA aplicados al análisis.','Deseable: experiencia en agencias o con varias cuentas a la vez, email marketing, automatizaciones y CRO.']),
 dict(slug='paid-media-specialist', titulo='Paid Media Specialist', eyebrow='Búsqueda abierta', area='Pauta',
  bajada='Buscamos a alguien que gestione campañas de alto impacto en Meta y Google, y que sepa explicarle a cada cliente qué se hizo y por qué.',
  meta=['100% remoto','Horario flexible','Por objetivos'],
  intro='En Studio Complex manejamos campañas de Google y Meta Ads para empresas y tiendas online. Sumamos a alguien con dominio técnico de las plataformas, mirada analítica y buena comunicación para trabajar directo con los clientes.',
  hacer=['Gestionar y optimizar campañas de Meta y Google Ads, cumpliendo objetivos y presupuesto.','Configurar la medición de conversiones con Google Tag Manager y GA4.','Analizar métricas y proponer mejoras con fundamento.','Presentar resultados y próximos pasos en reuniones con clientes.','Preparar informes claros, con conclusiones accionables.','Coordinar con diseño para que los anuncios estén alineados con la estrategia.','Mantenerte al día con las novedades de cada plataforma.'],
  buscamos=['Experiencia comprobable gestionando campañas de Meta Ads y Google Ads.','Capacidad para analizar métricas y optimizar el rendimiento.','Buena comunicación con clientes y con el equipo.','Organización para llevar varias cuentas y entregas a la vez.','Atención al detalle y foco en la calidad.','Ganas de trabajar con agentes de IA aplicados a la gestión de campañas.','Deseable: TikTok o Pinterest Ads, experiencia en eCommerce e inglés intermedio.']),
 dict(slug='creativo-audiovisual', titulo='Creativo/a Audiovisual', eyebrow='Búsqueda abierta', area='Creatividad',
  bajada='Buscamos a alguien que combine diseño gráfico, edición de video e inteligencia artificial en su trabajo de todos los días.',
  meta=['100% remoto','Horario flexible','Por objetivos'],
  intro='En Studio Complex hacemos las piezas de las campañas y las redes de nuestros clientes. Sumamos a alguien con criterio para las piezas, ojo para el contenido y capacidad para traducir lo que necesita cada cliente en propuestas concretas.',
  hacer=['Diseñar piezas gráficas y videos para tiendas online, redes y anuncios en Meta, TikTok y Google.','Editar videos con criterio narrativo: guion, gancho inicial y recursos pensados para convertir.','Entender lo que necesita cada cliente y proponer soluciones creativas concretas.','Adaptar cada pieza a los distintos formatos y plataformas.','Sumar herramientas de IA a la producción para ganar calidad y velocidad.'],
  buscamos=['Dominio de Illustrator y Photoshop.','Experiencia en edición de video (Premiere, After Effects o CapCut).','Uso activo de herramientas de IA en tu proceso creativo (imagen, video o voz).','Portfolio con piezas gráficas, videos editados y contenido hecho con IA.','Autonomía para llevar varios proyectos y clientes en paralelo.','Conocimiento de formatos y tendencias: Reels, TikTok, Stories y Shorts.','Deseable: Runway, Kling, HeyGen, Midjourney, Flux o ElevenLabs.']),
]
def lista(xs): return '<ul>\n' + '\n'.join(f'<li>{x}</li>' for x in xs) + '\n</ul>'
def pagina(v):
    s = MOLDE
    wa = WA + urllib.parse.quote(f"Hola, quiero postularme a la búsqueda de {v['titulo']} de Studio Complex. Mi nombre es ")
    s = re.sub(r'https://wa\.me/5491153362945\?text=[^"]+', wa, s)
    s = s.replace('vacante-ejecutivo-comercial.html', f"vacante-{v['slug']}.html")
    s = re.sub(r'<title>.*?</title>', f"<title>{v['titulo']} · Trabajá con nosotros | Studio Complex</title>", s, 1)
    s = re.sub(r'(<meta name="description"\s+content=")[^"]*', r'\g<1>' + f"Buscamos {v['titulo']} para Studio Complex: {v['bajada'][:110]} 100% remoto.", s, 1)
    s = re.sub(r'"title": "[^"]*"', f'"title": "{v["titulo"]}"', s, 1)
    s = re.sub(r'"description": "<p>.*?</p>",', '"description": "<p>' + v['intro'].replace('"', "'") + '</p><p>Modalidad 100% remota, por objetivos.</p>",', s, 1, flags=re.S)
    s = s.replace('<h1 class="sc-nota-titulo">Ejecutivo/a Comercial</h1>', f'<h1 class="sc-nota-titulo">{v["titulo"]}</h1>')
    s = re.sub(r'<p class="sc-nota-bajada">.*?</p>', f'<p class="sc-nota-bajada">{v["bajada"]}</p>', s, 1, flags=re.S)
    s = re.sub(r'<div class="sc-nota-meta">.*?</div>', '<div class="sc-nota-meta">' + ''.join(f'<span>{m}</span>' for m in v['meta']) + '</div>', s, 1, flags=re.S)
    s = s.replace('<span aria-hidden="true">/</span><span>Ejecutivo/a Comercial</span>', '<span aria-hidden="true">/</span><span>' + v['titulo'] + '</span>')
    cuerpo = f"<p>{v['intro']}</p>\n\n<h2>Lo que vas a hacer</h2>\n{lista(v['hacer'])}\n\n<h2>Lo que buscamos</h2>\n{lista(v['buscamos'])}\n\n{BENEFICIOS}\n\n<blockquote>¡Esperamos tu postulación para empezar el proceso de selección!</blockquote>\n"
    s = re.sub(r'<div class="sc-nota-ancho sc-nota-cuerpo">\n.*?(\n\s*<aside class="sc-nota-servicio">)', '<div class="sc-nota-ancho sc-nota-cuerpo">\n' + cuerpo.replace('\\', r'\\') + r'\1', s, 1, flags=re.S)
    s = s.replace('Escribinos por WhatsApp con tu nombre y tu LinkedIn o CV.', 'Escribinos por WhatsApp con tu nombre y tu LinkedIn, CV o portfolio.')
    s = s.replace('BÚSQUEDA LABORAL · Ejecutivo/a Comercial (6/11/2026)', f"BÚSQUEDA LABORAL · {v['titulo']} (6/11/2026, generada con tools/vacantes.py)")
    open(f"vacante-{v['slug']}.html", 'w').write(s)
for v in VACANTES: pagina(v)
print('ok', [v['slug'] for v in VACANTES])
