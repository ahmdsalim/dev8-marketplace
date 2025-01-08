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
import { Download, MoreHorizontal, Check } from "lucide-react";
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
import React, { useState, useEffect } from "react";
import PaginationInfo from "@/components/admin/PaginationInfo";
import useOrderList from "@/hooks/admin/useOrderList";
import "@/utils/DateFormat";
import toast from "react-hot-toast";
import exportData from "@/hooks/admin/exportData";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";
import { formatRupiah } from "@/utils/FormatRupiah";
import ucFirst from "@/utils/UcFirst";
import ucWords from "@/utils/UcWords";
import DetailOrderDialog from "@/components/admin/DetailOrderDialog";

export default function Orders() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [status, setStatus] = useState("all");
  const [limit, setLimit] = useState(10);
  const [rowAction, setRowAction] = useState(null);
  const [exportSelected, setExportSelected] = useState("all");
  const [isExporting, setExporting] = useState();

  const {
    data: orderData = {},
    isLoading,
    error,
  } = useOrderList({ page, searchQuery: debouncedSearch, sortBy: sort, limit, status });

  const orders = orderData.result || [];
  const total = orderData.total || 0;

  const breadcrumbItems = [
    { href: "/dashboard", label: "Dashboard" },
    { label: "Orders" },
  ];
  const tableHeaders = [
    "Order ID",
    "Order Date",
    "Customer Name",
    "Customer Email",
    "Courier",
    "Courier Service",
    "Status Order",
    "Payment Method",
    "Total",
    "",
  ];

  const exportOptions = [
    { label: "All", value: "all" },
    { label: "Last Week", value: "last_week" },
    { label: "Last Month", value: "last_month" },
    { label: "Last 3 Months", value: "last_3_months" },
    { label: "Last 6 Months", value: "last_6_months" },
    { label: "Last Year", value: "last_year" },
  ];

  const sortOptions = [
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
    { label: "Highest Amount", value: "highest-amount" },
    { label: "Lowest Amount", value: "lowest-amount" },
  ];

  const statusOptions = [
    { label: "All", value: "all" },
    { label: "Processed", value: "processed" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Failed", value: "failed" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return "bg-green-200/70 text-green-600 font-medium";
      case "pending":
        return "bg-yellow-200/70 text-yellow-600 font-medium";
      case "cancelled":
        return "bg-orange-200/70 text-orange-600 font-medium";
      default:
        return "bg-red-200/70 text-red-600 font-medium";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (e, selected) => {
    setSort(selected);
  };

  const handleLimit = (value) => {
    setLimit(value);
  };

  const handleFilter = (e, selected) => {
    setStatus(selected);
  };

  const handleExportSelected = (value) => {
    setExportSelected(value);
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      await exportData(`/data/orders/export?option=${exportSelected}`, "orders");
      showSuccessToast("orders exported successfully");
    } catch (error) {
      showErrorToast("Failed to export orders");
      console.error("Failed to export orders", error);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [limit, sort, debouncedSearch, status]);

  if (error) {
    toast.error("Failed to fetch orders");
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start gap-y-1.5">
          <h2 className="text-3xl font-semibold text-slate-800 tracking-tight">
            List Orders
          </h2>
          <div className="text-sm text-slate-500">
            Manage and view all orders
          </div>
        </div>
        <div className="flex gap-2 self-start">
          {/* Select export range */}
          <Select value={`${exportSelected}`} onValueChange={handleExportSelected}>
            <SelectTrigger className="bg-white h-8 min-w-20">
              <SelectValue placeholder={`${exportSelected}`} />
            </SelectTrigger>
            <SelectContent>
              {exportOptions.map((option, index) => (
                <SelectItem key={index} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            size="sm"
            className="w-full sm:w-auto"
            disabled={isExporting}
            onClick={handleExport}
          >
            <Download className="size-4" aria-hidden="true" />
            {isExporting ? "Exporting..." : "Export"}
          </Button>
        </div>
      </div>
      <Card>
        <CardContent className="p-6 md:px-8 md:py-10 space-y-4">
          {/* Table Nav */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2 flex-wrap items-center">
              <Input
                type="search"
                placeholder="Search orders"
                className="h-8 w-[150px] lg:w-[250px] text-sm"
                value={search}
                onChange={handleSearch}
              />
              {/* sort table */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                  <span className="text-slate-500">Sort By:</span> {ucFirst(sort)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {sortOptions.map(({ label, value }, index) => (
                    <DropdownMenuItem key={index} onSelect={(e) => handleSort(e, value)}>
                      {label} {sort === value && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* filter table by status */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <span className="text-slate-500">Status:</span> {ucFirst(status)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {statusOptions.map(({ label, value }, index) => (
                    <DropdownMenuItem key={index} onSelect={(e) => handleFilter(e, value)}>
                      {label} {status === value && <Check className="ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
                      <TableCell>
                        <div className="h-5 bg-slate-200 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 bg-slate-200 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 bg-slate-200 rounded"></div>
                      </TableCell>
                      <TableCell>
                        <div className="h-5 bg-slate-200 rounded"></div>
                      </TableCell>
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
                ) : orders.length > 0 ? (
                  orders.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.invoice_number}</TableCell>
                      <TableCell>
                        {new Date(item.order_date).toDateTimeFormat()}
                      </TableCell>
                      <TableCell>{item.user.name}</TableCell>
                      <TableCell>{item.user.email}</TableCell>
                      <TableCell>{ucWords(item.courier)}</TableCell>
                      <TableCell>{ucWords(item.courier_service)}</TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 rounded-full text-center ${getStatusColor(item.status)}`}>{ucFirst(item.status)}</div>
                      </TableCell>
                      <TableCell>
                        {ucWords(item.payment?.payment_method)}
                      </TableCell>
                      <TableCell>{formatRupiah(item.total_amount)}</TableCell>
                      <TableCell className="sticky right-0 w-10 bg-white opacity-[0.97] z-10">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              className="flex size-8 p-0 data-[state=open]:bg-muted relative"
                            >
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                              { item.status === "processed" && item.resi_number === "" && <div className="rounded-full h-2 w-2 bg-red-600 animate-ping absolute right-0 top-0"></div> }
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onSelect={() =>
                                setRowAction({ data: item, type: "detail" })
                              }
                            >
                              Detail
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="text-slate-500">
                    <TableCell
                      colSpan={tableHeaders.length}
                      className="text-center"
                    >
                      No orders found
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
          { rowAction?.type === "detail" && (
            <DetailOrderDialog
              open={rowAction?.type === "detail"}
              onOpenChange={() => setRowAction(null)}
              order={rowAction?.data ?? null}
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
