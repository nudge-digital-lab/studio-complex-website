// Íconos de línea propios (sin logos de terceros), trazo 2 en caja 24x24
window.ICO={
tienda:'<path d="M3 9l1.5-5h15L21 9"/><path d="M4 9v11h16V9"/><path d="M3 9a3 3 0 006 0 3 3 0 006 0 3 3 0 006 0"/><path d="M10 20v-5h4v5"/>',
web:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M10 13l-2 2 2 2M14 13l2 2-2 2"/>',
seo:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="M15.5 15.5L21 21"/><path d="M7.5 12l2-2 1.5 1.5 2.5-3"/>',
auto:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
ads:'<path d="M3 11v2a1 1 0 001 1h3l6 4V6L7 10H4a1 1 0 00-1 1z"/><path d="M17 8a5 5 0 010 8M19.5 5.5a8.5 8.5 0 010 13"/>'
};
document.querySelectorAll('[data-ico]').forEach(function(e){e.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+ICO[e.dataset.ico]+'</svg>'});
