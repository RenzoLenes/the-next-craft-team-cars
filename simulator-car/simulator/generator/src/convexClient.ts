import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

const url = process.env.CONVEX_URL;
if (!url) {
  throw new Error(
    "Falta CONVEX_URL. Copia la NEXT_PUBLIC_CONVEX_URL que generó `npx convex dev` en web/.env.local",
  );
}

export const convex = new ConvexHttpClient(url);

// anyApi evita depender del código generado (convex/_generated/api) del paquete `web`:
// el simulador es un servicio independiente que solo conoce los nombres de función por convención.
export const api = anyApi;
