import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import type { ReactNode } from "react";

import { AppSidebar } from "@/components/app/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function AppLayout({ children }: { children: ReactNode }) {
  // Auth por recurso: todo lo que cuelga de este layout exige sesión.
  await auth.protect();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/80 px-4 backdrop-blur">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="font-[family-name:var(--font-display)] text-[11px] font-bold tracking-[0.18em] uppercase">
            Consola
          </span>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden items-center gap-1.5 text-[11px] text-muted-foreground sm:flex">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              en vivo
            </span>
            <UserButton />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
