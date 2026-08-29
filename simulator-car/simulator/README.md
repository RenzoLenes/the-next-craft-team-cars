# Simulador — carpeta autocontenida

Todo lo que necesita el rol "Simulador" vive acá adentro. No depende de `web/` ni al
revés (excepto por la URL de Convex, que es config, no código compartido).

- `generator/` — Node + TS. Genera telemetría sintética y la empuja a Convex. Expone una
  API HTTP de control en `:4000`.
- `control-panel/` — Next.js. UI para arrancar/parar vehículos e inyectar fallas,
  llamando a la API de `generator/`. No usa Convex directamente.

Ver instrucciones de setup y ejecución en el `README.md` de la raíz del repo.
