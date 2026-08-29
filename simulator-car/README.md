# FleetCare

App de mantenimiento predictivo vehicular (hackathon). Simulador de telemetría OBD-II →
Convex (real-time, detección de fallas por reglas/umbrales) → dashboard Next.js.

## Estructura del repo (por rol de equipo)

```
simulator/            ← rol "Simulador" (autocontenido, no lo toca nadie más)
  generator/             Node + TS, servicio independiente:
                          - genera telemetría sintética cada 1-2s (motor, batería,
                            refrigerante, DTC) con curvas de degradación por falla
                          - empuja cada lectura a Convex vía ConvexHttpClient
                          - expone API HTTP de control (start/stop/inject-fault) en :4000
  control-panel/         Next.js — "front de control" del simulador (:3001):
                          arranca/detiene vehículos e inyecta fallas llamando a la API
                          del generator. No depende de Convex directamente.

web/                   ← rol "Frontend/app": dashboard de flota + alertas en vivo
convex/ (dentro de web/) ← rol "Convex backend-core": schema + mutations/queries.
                          Es el contrato de datos que consume tanto `web/` como
                          `simulator/generator` (vía HTTP, sin importar código entre sí).
```

`simulator/` es responsabilidad de un solo rol y no tiene por qué tocarse desde `web/` ni
viceversa — la única conexión entre carpetas es la URL de Convex (env var) y, dentro de
`simulator/`, la URL del generator que usa el control-panel.

## Por qué generator y control-panel están separados

Next.js/Vercel son request-response y no sostienen un `setInterval` de larga duración,
por eso el generador de telemetría vive en su propio proceso Node (`simulator/generator`)
en vez de ser una API route de Next.

## Setup

Requiere una cuenta de Convex (gratis, login por navegador — no se puede automatizar).
Convex vive dentro de `web/` porque es el proyecto que lo inicializó, pero el schema es
el contrato compartido de todo el equipo (rol "Convex backend-core").

```bash
npm install                  # instala los 3 workspaces (web, simulator/generator, simulator/control-panel)

cd web
npx convex dev                # login + crea el proyecto/deployment, genera convex/_generated/
                               # y escribe .env.local con NEXT_PUBLIC_CONVEX_URL
```

Copiá esa misma URL a `simulator/generator/.env` (ver `.env.example` en esa carpeta):

```bash
cd simulator/generator
cp .env.example .env
# pega CONVEX_URL=<la NEXT_PUBLIC_CONVEX_URL de web/.env.local>
```

## Correr todo (4 terminales)

```bash
cd web                    && npx convex dev        # 1. backend Convex (deja corriendo)
cd web                    && npm run dev            # 2. dashboard         → :3000
cd simulator/generator    && npm run dev            # 3. generador + API   → :4000
cd simulator/control-panel && npm run dev           # 4. panel de control  → :3001
```

Abrí `http://localhost:3001`, dale Start a un vehículo, y mirá los datos llegar en vivo a
`http://localhost:3000`. Para la demo de detección temprana, inyectá una falla (overheat /
battery_undercharge / battery_overcharge / check_engine) desde el panel — la alerta
aparece en el dashboard en ~15-45s a medida que la curva de degradación avanza.

## Vehículos simulados

2 modelos, cada uno con estado y curva de falla independientes:

- **Toyota Corolla** (`OBD-2026-X8912`)
- **Toyota Hilux** (`OBD-2026-H1120`) — el vehículo comercial/de flota más común en Perú

Ambos comparten la misma lógica de generación (`simulator/generator/src/generator.ts`);
lo que los distingue hoy es identidad (deviceId/VIN/label), no física distinta del motor.

## Umbrales de fallas (reglas, no ML)

Viven en `web/convex/telemetry.ts`, evaluados dentro de la misma mutation `ingest`:

- **Sobrecalentamiento**: refrigerante ≥105°C (warning), ≥115°C (critical)
- **Batería descargando**: voltaje ≤13.2V (warning), ≤12.2V (critical)
- **Batería sobrecargando**: voltaje ≥15.0V (warning)
- **Check engine**: `mil_status=true` o `dtc_count>0`

## Visualización 3D (WebGPU)

Cada card de vehículo en el dashboard (`web/`) renderiza un modelo 3D (`three/webgpu` vía
`@react-three/fiber`) que reacciona en vivo a la telemetría: el color del auto vira a
rojo con la temperatura de refrigerante, parpadea en amarillo cuando la batería sale de
rango, y la velocidad de rotación depende del RPM. El renderer cae solo a WebGL si el
navegador no soporta WebGPU.

Modelo: `web/public/models/ToyCar.glb` — "Toy Car" de Khronos Group
(glTF-Sample-Assets), licencia CC0 1.0 (dominio público). Es un modelo genérico: los 2
vehículos comparten el mismo asset 3D y se distinguen por su `label`/telemetría, no por
geometría distinta.

## Deploy

- `web/` → Vercel (o Amplify Hosting) con `NEXT_PUBLIC_CONVEX_URL` como env var de build.
- `simulator/control-panel/` → Vercel, con `NEXT_PUBLIC_SIMULATOR_API_URL` apuntando al
  generator desplegado.
- `simulator/generator/` → cualquier host que sostenga un proceso Node persistente
  (Fly.io, Render, Railway) — no Vercel serverless. Para la demo del hackathon alcanza
  con correrlo local.
