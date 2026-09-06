import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Archivo, Public_Sans, Space_Mono } from "next/font/google";
import type { ReactNode } from "react";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const publicSans = Public_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fleet Care — Monitoreo IoT y señales de control",
  description:
    "Supervisa en tiempo real las métricas de tu flota de autos, recibe alertas y emite señales de control operativas.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${publicSans.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-[family-name:var(--font-body)]">
        <ClerkProvider>
          <ConvexClientProvider>
            <TooltipProvider>{children}</TooltipProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
