import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, Lightbulb, GitCompareArrows, Layers, Radar, ShieldCheck, Info, Plus } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { semanticEngineMode } from "@/lib/semantic-api";

const NAV = [
  { title: "Overview", url: "/", icon: LayoutGrid },
  { title: "Submit Idea", url: "/submit", icon: Lightbulb },
  { title: "Similar Ideas", url: "/similar", icon: GitCompareArrows },
  { title: "AI Themes", url: "/themes", icon: Layers },
  { title: "Innovation Radar", url: "/radar", icon: Radar },
  { title: "Trust & Privacy", url: "/trust", icon: ShieldCheck },
  { title: "About", url: "/about", icon: Info },
] as const;

function AppSidebar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const active = (u: string) => (u === "/" ? path === "/" : path.startsWith(u));
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-12 flex-row items-center gap-2 border-b border-sidebar-border px-3">
        <span className="grid size-7 shrink-0 place-items-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
          <Radar className="size-4" />
        </span>
        <span className="truncate text-sm font-semibold text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
          Innovation Radar
        </span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((n) => (
                <SidebarMenuItem key={n.url}>
                  <SidebarMenuButton asChild isActive={active(n.url)} tooltip={n.title}>
                    <Link to={n.url}>
                      <n.icon />
                      <span>{n.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 pb-3 text-[11px] text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
        v0.6 · Independent Prototype
      </SidebarFooter>
    </Sidebar>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const mode = semanticEngineMode();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-12 items-center gap-3 border-b bg-card px-3 md:px-4 backdrop-blur">
            <SidebarTrigger />
            <span className="hidden text-sm font-semibold sm:inline">Secure Innovation Radar</span>
            <span className="rounded border border-primary/30 bg-primary-soft px-1.5 py-0.5 text-[11px] font-medium text-primary">
              Synthetic Demo
            </span>
            <div className="ml-auto flex items-center gap-4">
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
                <span className="size-1.5 rounded-full bg-success" />
                {mode === "remote" ? "Semantic Engine: Live API" : "Semantic Engine: Live Browser"}
              </span>
              <Button size="sm" asChild>
                <Link to="/submit"><Plus /><span className="hidden sm:inline">Submit Idea</span></Link>
              </Button>
              <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                DU
              </span>
            </div>
          </header>
          <main className="mx-auto w-full max-w-[1440px] flex-1 p-3 md:p-5">{children}</main>
          <footer className="shrink-0 border-t bg-card px-3 py-3 text-xs text-muted-foreground md:px-5">
            Independent prototype using synthetic data only. Not affiliated with or commissioned by GFE.
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
