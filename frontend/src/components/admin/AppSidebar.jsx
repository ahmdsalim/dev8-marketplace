import {
  Archive,
  Blocks,
  User2,
  ClipboardList,
  Tags,
  PackagePlus,
  Command,
  Settings2,
  LayoutDashboard
} from "lucide-react"

import { NavMain } from "@/components/admin/NavMain"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: User2,
    },
    {
      title: "Categories",
      url: "/dashboard/categories",
      icon: Blocks
    },
    {
      title: "Collaborations",
      url: "/dashboard/collaborations",
      icon: Tags
    },
    {
      title: "Variants",
      url: "/dashboard/variants",
      icon: PackagePlus
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Archive
    },
    {
      title: "Orders",
      url: "/dashboard/orders",
      icon: ClipboardList
    },
    // {
    //   title: "Settings",
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
}

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Reto</span>
                  <span className="truncate text-xs">Marketplace</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
    </Sidebar>
  )
}