import { clerkMiddleware } from "@clerk/nextjs/server";

// La protección NO vive aquí: se hace por recurso en `src/app/(app)/layout.tsx`
// con `await auth.protect()`. Emparejar rutas por path puede divergir de cómo
// Next resuelve las peticiones y dejar recursos protegidos alcanzables.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
