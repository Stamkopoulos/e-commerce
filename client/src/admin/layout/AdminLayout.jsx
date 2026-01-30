import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Sidebar";

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function AdminLayout() {
  return (
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
    </SidebarProvider>
  );
}
