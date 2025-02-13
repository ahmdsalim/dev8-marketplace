import { useEffect, useState, Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Check, MailOpen } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useNotifications,
  useMarkAsRead,
  useMarkAllAsRead,
} from "@/hooks/admin/notificationHooks";
import toast from "react-hot-toast";
import PaginationInfo from "@/components/admin/PaginationInfo";
import UcFirst from "@/utils/UcFirst";
import { useQueryClient } from "react-query";

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [type, setType] = useState("all");
  const [limit, setLimit] = useState(10);
  const { mutate: markAllAsReadMutate, isLoading: isMarkAllLoading } = useMarkAllAsRead();
  const { mutate: markAsReadMutate } = useMarkAsRead();
  const queryClient = useQueryClient();

  const {
    data: { result: notifications = [], total = 0 } = {},
    isLoading,
    error,
  } = useNotifications({ page, searchQuery: debouncedSearch, type, limit });

  const breadcrumbItems = [
    { href: "/dashboard", label: "Dashboard" },
    { label: "Notifications" },
  ];
  const tableHeaders = ["Notification", "", ""];

  const typeOptions = [
    {
      label: "All",
      value: "all"
    },
    {
      label: "User",
      value: "user"
    },
    {
      label: "Order",
      value: "order"
    },
  ]

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleType = (e, selected) => {
    setType(selected);
  };

  const handleLimit = (value) => {
    setLimit(value);
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
    e.currentTarget.setAttribute('disabled', true);
    
    markAsReadMutate(id, {
      onSuccess: async () => {
        await Promise.all(queryClient.invalidateQueries({
          queryKey: ["notifications"],
          exact: false,
        }),
        queryClient.invalidateQueries({
          queryKey: ["latestnotifications"],
          exact: false,
        })
      );
      },
      onSettled: () => e.currentTarget.removeAttribute('disabled')
    })
  }

  useEffect(() => {
    setPage(1);
  }, [limit, type, debouncedSearch]);

  if (error) {
    toast.error("Failed to fetch notifications");
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center">
        <div className="flex flex-col items-start gap-y-1.5">
          <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">
            Notifications
          </h2>
          <div className="text-sm text-slate-500">
            Manage and view all notifications
          </div>
        </div>
      </div>
      <Card>
        <CardContent className="p-6 md:px-8 md:py-10 space-y-4">
          {/* Table Nav */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Input
                type="search"
                placeholder="Search notifications"
                className="h-8 w-[150px] lg:w-[250px] text-sm"
                value={search}
                onChange={handleSearch}
              />
              {/* Type table */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="ml-2">
                    <span className="text-slate-500">Type:</span> {UcFirst(type)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  { typeOptions.map((option, index) => (
                    <DropdownMenuItem key={index} onSelect={(e) => handleType(e, option.value)}>
                      { option.label } {type === option.value && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  )) }
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                disabled={isMarkAllLoading}
                onClick={handleMarkAll}
              >
                <MailOpen className="size-4" aria-hidden="true" />
                Mark all
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-sm border">
            <Table>
              <TableHeader>
                <TableRow>
                  {tableHeaders.map((header, index) => (
                    <TableHead
                      key={index}
                      className={`${
                        index === tableHeaders.length - 1 &&
                        "sticky right-0 w-10 bg-white opacity-[0.97] z-10"
                      }`}
                    >
                      {header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 10 }).map((_, index) => (
                    <TableRow key={index} className="animate-pulse">
                      <TableCell>
                        <div className="h-5 bg-slate-200 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 bg-slate-200 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 bg-slate-200 rounded"></div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : notifications.length > 0 ? (
                  notifications.map((item, index) => (
                    <TableRow key={index} className={`${ item.read_at ? 'bg-slate-100/50' : '' }`}>
                      <TableCell>{item.content}</TableCell>
                      <TableCell className="text-slate-500">{item.created_at}</TableCell>
                      <TableCell className={`sticky right-0 w-10 ${ item.read_at ? 'bg-slate-100/50' : 'bg-white'} opacity-[0.97] z-10`}>
                        { !item.read_at && (
                          <Button
                            variant="ghost"
                            className="flex size-8 p-0"
                            onClick={(e) => handleMarkAsRead(e, item.id)}
                          >
                            <span className="sr-only">Mark as read</span>
                            <MailOpen />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="text-slate-500">
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center"
                    >
                      No notifications found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-y-4">
            <div>
              <PaginationInfo
                currentPage={page}
                perPage={limit}
                totalEntries={total}
              />
            </div>
            <div className="flex flex-col-reverse md:flex-row items-center gap-x-4 gap-y-4">
              <div className="flex items-center gap-x-2">
                <label className="text-sm">Rows per page</label>
                <Select value={`${limit}`} onValueChange={handleLimit}>
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue placeholder={`${limit}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ul className="flex gap-2">
                <li>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={isLoading || page === 1}
                  >
                    Previous
                  </Button>
                </li>
                <li>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((prev) => prev + 1)}
                    disabled={isLoading || page === Math.ceil(total / limit)}
                  >
                    Next
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
