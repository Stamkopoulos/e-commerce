import { LayoutDashboard, Users, PackageOpen, Shirt } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { ModeToggle } from "@/components/ui/mode-toggle";

// Menu items for the admin dashboard
const items = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Shirt,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: PackageOpen,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
  },
];

export default function AdminSidebar() {
  const { user } = useUser();
  return (
    <Sidebar variant="inset" className="h-screen w-64 ">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-2 text-gray-500 uppercase text-xs font-semibold">
            Admin Page
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.url}
                        className="flex items-center gap-3 px-4 py-2 text-gray-400 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center justify-between px-2 py-2 gap-1">
              <div className="flex items-center gap-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                    },
                  }}
                />
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">
                    {user?.fullName || "Admin"}
                  </span>
                  <span className="text-xs text-muted-foreground">Admin</span>
                </div>
              </div>

              <ModeToggle />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
