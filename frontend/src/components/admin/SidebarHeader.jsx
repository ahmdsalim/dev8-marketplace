import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KeyRound, Bell, LogOut } from "lucide-react";
import { useAuth, useLogout } from "@/hooks/authHooks";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import getInitials from "@/utils/GetInitials";
import ChangePasswordDialog from "./ChangePasswordDialog";
import { useLatestNotifications, useMarkAsRead, useMarkAllAsRead } from "@/hooks/admin/notificationHooks";
import { useQueryClient } from "react-query";
import { Link } from "react-router-dom";

export const SidebarHeader = () => {
  const { user } = useAuth();
  const { mutate: logout } = useLogout();
  const navigate = useNavigate();
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const { isLoading: isNotifLoading, data: { result: notifications = [], total = 0 } = {} } = useLatestNotifications();
  const { mutate: markAsReadMutate } = useMarkAsRead();
  const { mutate: markAllAsReadMutate, isLoading: isMarkAllLoading } = useMarkAllAsRead();
  const queryClient = useQueryClient();

  const userData = {
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: "/avatars/shadcn.jpg",
  };

  const handleLogout = () => {
    // make toast promise
    toast.promise(
      new Promise((resolve, reject) => {
        logout(null, {
            onSuccess: async () => {
              navigate("/login");
              resolve();
            },
            onError: (error) => {
              reject(error);
            },
        })
      }),
      {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: "Failed to logout",
      }
    );
  };

  const handleMarkAll = () => {
    markAllAsReadMutate(null, {
      onSuccess: async () => {
        await Promise.all(
          queryClient.invalidateQueries({
            queryKey: ["notifications"],
            exact: false,
          }),
          queryClient.invalidateQueries({
            queryKey: ["latestnotifications"],
            exact: false,
          })
        );

        toast.success("Successfully marked all notification")
      }
    })
  }

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    e.currentTarget.setAttribute("disabled", true);
    markAsReadMutate(id, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["latestnotifications"],
          exact: false,
        });
      },
      onSettled: () => e.currentTarget.removeAttribute('disabled')
    })
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b gap-2">
      <div className="flex items-center gap-2 ps-5 sm:ps-10">
        <SidebarTrigger className="[&_svg]:size-5 -ml-1" />
      </div>
      <div className="flex items-center gap-x-5 pe-5 sm:pe-10">
        <DropdownMenu>
          <DropdownMenuTrigger className="relative outline-none">
            <Bell width={20} />
            { (total > 0) && (
              <span className="absolute top-0 left-1/2 tranform -translate-x-1/2 -translate-y-1/2 inline-flex items-center justify-center min-w-3 min-h-3 p-[0.2rem] rounded-sm bg-red-500 text-white text-xs overflow-hidden text-ellipsis whitespace-nowrap">
                { total }
              </span>
            ) }
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[300px]" sideOffset={10}>
            <div className="flex justify-between">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <button onClick={(e) => handleMarkAll(e)} disabled={isMarkAllLoading} className="px-2 py-1.5 text-xs text-blue-500 font-semibold">Mark all</button>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              { isNotifLoading ? (
                <div className="space-y-2 px-1">
                  { Array({ length: 5 }).map((_, index) => (
                    <div key={index} className="h-5 bg-slate-200 rounded animate-pulse"></div>
                  )) }
                </div>
              ) : (notifications.length > 0) ?
              notifications.map((notif) => (
                <DropdownMenuItem key={notif.id}>
                  <div className="w-full space-y-2">
                    <div className="truncate">{ notif.content }</div>
                    <div className="flex justify-between text-xs">
                      <button onClick={(e) => handleMarkAsRead(e, notif.id)} className="text-blue-500">Mark as read</button>
                      <div className="text-slate-500">{ notif.created_at }</div>
                    </div>
                  </div>
                </DropdownMenuItem>
              )) : (
                <div className="text-center text-sm py-2">No Notifications Yet</div>
              ) }
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem><Link to="/dashboard/notifications">View all notifications</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <div className="flex items-center gap-x-2.5">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-lg">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="truncate text-xs">{userData.role}</span>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-52 rounded-lg"
            align="end"
            sideOffset={10}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center px-2 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={() => setOpenChangePassword(true)}>
                <KeyRound />
                Change Password
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        { openChangePassword &&
          <ChangePasswordDialog
            open={openChangePassword}
            onOpenChange={() => setOpenChangePassword(false)}
          />
        }
      </div>
    </header>
  );
};
