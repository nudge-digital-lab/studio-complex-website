# Piezas de redes

Foto de perfil (1080x1080), portada de Facebook (1640x624) y portada de WhatsApp Business (1920x1080, 16:9). Las PNG finales están en Google Drive, carpeta «Studio Complex - Redes».

Identidad tomada de la web: Figtree (títulos en 600, letter-spacing -0.035em), naranja #F2801E, celeste #22D3EE, fondo #07090c con las ondas de `hero-bg.webp`, volanta celeste en mayúsculas y la palabra con degradé naranja → celeste.

`logo-sc-2048.png` es el logo de la web (256 px) reconstruido en alta: la «SC» limpia y el círculo redibujado. Si aparece el original en vector, reemplazarlo acá.

Para regenerar una pieza:

    CH=~/Library/Caches/ms-playwright/chromium_headless_shell-1223/chrome-headless-shell-mac-x64/chrome-headless-shell
    "$CH" --headless --hide-scrollbars --force-device-scale-factor=1 --virtual-time-budget=10000 \
      --allow-file-access-from-files --window-size=1640,624 \
      --screenshot="$PWD/facebook.png" "file://$PWD/facebook.html"
