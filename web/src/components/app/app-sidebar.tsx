"use client";

import {
  Activity,
  Car,
  Gauge,
  LayoutDashboard,
  Radio,
  Settings,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

type NavItem = {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  badge?: string;
};

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Operación",
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { title: "Vehículos", href: "/vehiculos", icon: Car },
      { title: "Alertas", href: "/alertas", icon: TriangleAlert, badge: "4" },
    ],
  },
  {
    label: "Análisis",
    items: [
      { title: "Telemetría", href: "/telemetria", icon: Activity },
      { title: "Mantenimiento", href: "/mantenimiento", icon: Wrench },
      { title: "Salud predictiva", href: "/salud", icon: Gauge },
    ],
  },
  {
    label: "Sistema",
    items: [
      { title: "Simulador", href: "/simulador", icon: Radio },
      { title: "Configuración", href: "/configuracion", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-3">
          <span
            aria-hidden
            className="size-2 shrink-0 rounded-full bg-[#dc2626] shadow-[0_0_0_3px_rgba(220,38,38,0.18)]"
          />
          <span className="font-[family-name:var(--font-display)] text-xs font-bold tracking-[0.2em] uppercase group-data-[collapsible=icon]:hidden">
            Señal
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="text-[10px] tracking-[0.18em] uppercase">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        render={<Link href={item.href} />}
                        isActive={active}
                        tooltip={item.title}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge className="text-[#dc2626]">
                          {item.badge}
                        </SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5 text-[11px] text-muted-foreground group-data-[collapsible=icon]:hidden">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          Telemetría en vivo
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
