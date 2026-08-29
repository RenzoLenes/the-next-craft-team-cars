# Design System: Fleet Care

## 1. Visual Theme & Atmosphere

Un instrumento de precisión que se ha ganado su calma. La atmósfera es la de un
taller de ingeniería bien iluminado: papel frío, tinta densa, y una sola señal
viva que respira. Nada grita — porque el producto existe para avisar *antes* de
que haya motivo para gritar. Si la interfaz es alarmista todo el tiempo, pierde
la capacidad de alarmar cuando importa.

- **Densidad:** 5 — equilibrada. Aire generoso en la landing, densidad de cabina en la consola.
- **Varianza:** 7 — asimetría deliberada. El hero es split, no centrado.
- **Movimiento:** 4 — fluido y contenido. Una sola orquestación al cargar; después, solo el latido de los datos vivos.

## 2. Color Palette & Roles

**La regla que gobierna todo:** el color de marca **nunca** puede coincidir con
un color semántico. Este producto vende legibilidad de gravedad; si el rojo es a
la vez el logo, el botón principal y la alerta crítica, el ojo deja de poder
separarlos. El acento de marca se mueve a teal y el rojo queda **reservado**.

### Superficie y tinta
- **Papel Frío** (`#F7F9FA`) — fondo primario de la landing
- **Panel** (`#EDF1F3`) — bandas de sección alternas, superficies hundidas
- **Blanco Instrumento** (`#FFFFFF`) — relleno de tarjetas y contenedores
- **Tinta Grafito** (`#12181B`) — texto primario. Nunca `#000000`
- **Acero Medio** (`#5A6B73`) — texto secundario, descripciones, metadatos
- **Línea Susurro** (`#DDE4E7`) — bordes de 1px, divisores estructurales

### Marca (uno solo, saturación < 80%)
- **Teal Señal** (`#0E7C6B`) — CTA primario, estados activos, focus rings, el punto del logo

### Semántico — RESERVADO, jamás decorativo
- **Verde Nominal** (`#2E7D52`) — dentro de umbral
- **Ámbar Atención** (`#B0710F`) — umbral suave cruzado
- **Rojo Crítico** (`#C0362E`) — umbral duro. **Este color no aparece en ningún elemento de marca.** Cuando se ve, significa algo.

## 3. Typography Rules

- **Display:** `Archivo` (700/800) — grotesca industrial con raíz de señalética. Tracking apretado (`-0.02em`), jerarquía por peso y color, **no** por mayúsculas forzadas. Los titulares van en caja normal: una H1 de ocho palabras en versalitas con tracking abierto es un obstáculo, no un estilo.
- **Body:** `Public Sans` (400/500) — interlineado holgado, máximo 65 caracteres por línea.
- **Mono:** `Space Mono` (400/700) — **solo** para datos, etiquetas, códigos DTC, timestamps y cifras. Nunca para prosa: un párrafo entero en monoespaciada cansa y no aporta significado.
- **Banned:** `Inter`, tipografías de sistema, serifas genéricas. Mayúsculas con tracking abierto en bloques de más de cuatro palabras.

## 4. Component Stylings

- **Botones:** `PillLink`, píldora con flecha en círculo, tres variantes (`dark`, `light`, `ghost`). Planos, sin resplandor exterior, feedback táctil de `-1px` en `:active`. Máximo dos por bloque: uno lleva al centro de control, el otro al simulador.
- **Tarjetas:** esquinas de 6px, sombra difusa teñida al tono del fondo. Solo cuando la elevación comunique jerarquía; en listas densas se reemplazan por divisores de borde superior.
- **Indicadores de estado:** un punto de color semántico + etiqueta en mono. El color nunca va solo — siempre acompañado de texto, para daltónicos y para captura de pantalla en blanco y negro.
- **Loaders:** esqueletos que replican las dimensiones reales. Nunca spinners circulares.

## 4b. Dirección fotográfica (referencia AeroCrop.ai)

- **Hero en video** a sangre completa con overlay oscuro en degradado; la barra de navegación flota en píldora con desenfoque. Titular en la mitad inferior izquierda. Dos datos con **línea guía punteada** (uno arriba a la derecha, uno abajo a la izquierda), un bloque de texto con regla vertical punteada, y chips de lecturas al pie.
- **CTA en píldora con flecha en círculo** (`PillLink`), tres variantes: `dark`, `light`, `ghost`. Es el único estilo de botón de la landing.
- **Sección de lecturas**: dos columnas (titular / prosa), y debajo una banda fotográfica oscurecida que contiene dos tarjetas blancas, cada una mitad foto y mitad dato con píldora de estado.
- **Sección de integración**: tres tarjetas con foto 4:3, etiqueta en píldora del color de acento, título y cuerpo. Es la única excepción autorizada a la prohibición de tres tarjetas iguales, por petición explícita.
- **Cierre**: titular centrado sobre una foto que se funde desde el fondo claro; debajo, tarjeta de estado con datos verificables y pie de cuatro columnas claro.
- **Toda foto y video se inspecciona a ojo antes de fijarlo.** Un `200` solo dice que el enlace existe. Se descartan imágenes con marcas ajenas visibles.
- **Cifras**: solo las que salen del código (`1,5 s` de muestreo, `12` señales por lectura, umbrales de `telemetry.ts`). Nunca las de la referencia.

## 5. Layout Principles

- Hero **asimétrico**: titular abajo a la izquierda, datos en las esquinas opuestas, texto explicativo abajo a la derecha. El único bloque centrado de la página es el cierre.
- Filas de tarjetas iguales solo en la sección de integración (§4b). En el resto: dos columnas o rejilla asimétrica donde el peso visual comunique prioridad.
- CSS Grid antes que aritmética de flexbox. Sin `calc()` de porcentajes.
- Contención a `max-width: 1200px` centrado.
- Alto completo con `min-h-[100dvh]`, nunca `h-screen`.
- Colapso a una sola columna por debajo de 768px, sin excepciones. Cero scroll horizontal.

## 6. Motion & Interaction

- Una orquestación al cargar: revelado en cascada con retardos escalonados de 60ms. Después, quietud.
- El único movimiento perpetuo permitido es **el latido del dato vivo** — el punto de estado. Si todo pulsa, nada llama la atención.
- Solo `transform` y `opacity`. Jamás `top`, `left`, `width` ni `height`.
- Respetar `prefers-reduced-motion` en todo.

## 7. Anti-Patterns (Banned)

- **Datos inventados.** Si una cifra no sale del código o de una medición, no va. Las de la referencia (`98.4%`, `3 Mins`, `412.8 TB`) son relleno.
- Rojo como color de marca (colisiona con el semántico crítico).
- Tarjetas idénticas fuera de la sección de integración.
- Más de dos CTAs en un mismo bloque.
- Prosa larga en monoespaciada.
- Titulares largos en mayúsculas con tracking abierto.
- Marca repetida dos veces seguidas (un `<p>` con el nombre justo encima del `<h1>`).
- Emojis, negro puro, resplandores neón, cursores personalizados.
- Clichés de copy: "Eleva", "Sin fricción", "Próxima generación", "Todo lo necesario para operar al máximo rendimiento".
- Texto de relleno: "Scroll para explorar", flechas rebotando.
