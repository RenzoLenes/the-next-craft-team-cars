import type { Metadata } from "next";
import { Space_Mono, Syncopate } from "next/font/google";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const syncopate = Syncopate({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Señal — Control de métricas de autos",
  description:
    "Consola para controlar métricas de autos y emitir señales de control operativas.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${syncopate.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-[family-name:var(--font-mono)]">
        <ConvexClientProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
