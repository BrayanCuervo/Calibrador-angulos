# Calibrador-angulos 📱

App móvil con React Native + Expo Router (navegación solo por **Tabs**).

```
explorador/
├── app/
│   ├── _layout.tsx          # Layout raíz
│   └── (tabs)/
│       ├── _layout.tsx      # Configuración de Tabs
│       ├── index.tsx        # Sensor: nivel de burbuja (acelerómetro)
│       ├── audio.tsx        # Nativa 1: grabación de audio
│       └── location.tsx     # Nativa 2: geolocalización
├── components/ui.tsx        # Card, Button, Row y estilos compartidos
├── constants/theme.ts       # Paleta de colores
├── assets/
├── app.json · eas.json · package.json · tsconfig.json
```

## Validación de sistema operativo
- Signo del eje X del acelerómetro (iOS vs Android).
- Vibración distinta por plataforma.
- Modo de audio de iOS (`playsInSilentMode`) al grabar.
- Sombras (iOS) vs `elevation` (Android) y alto de la tab bar.
- Esquema de URL del mapa (`maps:` en iOS, `geo:` en Android).
- Feedback táctil: opacidad (iOS) vs ripple (Android).

## Ejecutar
```bash
npm install
npx expo install --fix
npx expo start
```

