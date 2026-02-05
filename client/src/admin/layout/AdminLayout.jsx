import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Sidebar";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import { ThemeProvider } from "@/components/ui/theme-provider";

import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider
        style={{
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        }}
      >
        {/* Sidebar */}
        <AdminSidebar />

        {/* Content area that reacts to sidebar */}
        <SidebarInset>
          <main className="flex flex-col gap-6 p-6">
            <SidebarTrigger />
            <Outlet />
          </main>
        </SidebarInset>
        <Toaster position="top-right" richColors closeButton />
      </SidebarProvider>
    </ThemeProvider>
  );
}
