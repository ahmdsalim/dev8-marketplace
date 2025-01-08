import { AppSidebar } from "@/components/admin/AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { SidebarHeader } from "./SidebarHeader";

export default function DashboardLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="min-w-0">
        <SidebarHeader />
        <div className="flex flex-1 flex-col gap-4 px-5 sm:px-10 py-5 bg-slate-300/10">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
