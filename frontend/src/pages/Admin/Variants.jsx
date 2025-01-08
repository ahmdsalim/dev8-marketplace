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
    DropdownMenuSeparator,
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
  import toast from "react-hot-toast";
  import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";
  import UcFirst from "@/utils/UcFirst";
  import useVariantList from "@/hooks/admin/useVariantList";
  import AddVariantDialog from "@/components/admin/AddVariantDialog";
  import UpdateVariantDialog from "@/components/admin/UpdateVariantDialog";
  import DeleteVariantDialog from "@/components/admin/DeleteVariantDialog";
  import exportData from "@/hooks/admin/exportData";
  
  export default function Variants() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("all");
    const [limit, setLimit] = useState(10);
    const [rowAction, setRowAction] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setExporting] = useState();
  
    const {
      data: variantData = {},
      isLoading,
      error,
    } = useVariantList({ page, searchQuery: debouncedSearch, type, limit });
  
    const variants = variantData.result || [];
    const total = variantData.total || 0;
  
    const breadcrumbItems = [
      { href: "/dashboard", label: "Dashboard" },
      { label: "Variants" },
    ];
    const tableHeaders = ["Variant", "Type", ""];

    const typeOptions = [
      { label: "All", value: "all" },
      { label: "Pakaian", value: "pakaian" },
      { label: "Celana", value: "celana" },
      { label: "Sepatu", value: "sepatu" },
    ];
  
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
  
    const handleExport = async () => {
      try {
        setExporting(true);
        await exportData("/variants/export", "variants");
        showSuccessToast("Variants exported successfully");
      } catch (error) {
        showErrorToast("Failed to export variants");
        console.error("Failed to export variants", error);
      } finally {
        setExporting(false);
      }
    };
  
    useEffect(() => {
      setPage(1);
    }, [limit, type, debouncedSearch]);
  
    if (error) {
      toast.error("Failed to fetch variants");
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
              List Variants
            </h2>
            <div className="text-sm text-slate-500">
              Manage and view all variants
            </div>
          </div>
          <div className="flex self-start">
            <Button className="w-full sm:w-auto" size="sm" onClick={() => setIsOpen(true)}>
              Add Variant
            </Button>
            <AddVariantDialog
              open={isOpen}
              onOpenChange={() => setIsOpen(false)}
            />
          </div>
        </div>
        <Card>
          <CardContent className="p-6 md:px-8 md:py-10 space-y-4">
            {/* Table Nav */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search variants"
                  className="h-8 w-[150px] lg:w-[250px] text-sm"
                  value={search}
                  onChange={handleSearch}
                />
                {/* filter table */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2">
                      <span className="text-slate-500">Type:</span> { UcFirst(type) }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {typeOptions.map((option, index) => (
                      <DropdownMenuItem key={index} onSelect={(e) => handleType(e, option.value)}>
                        {option.label} {type === option.value && <Check className="ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center">
                <Button variant="outline" size="sm" className="gap-2" disabled={isExporting} onClick={handleExport}>
                  <Download className="size-4" aria-hidden="true" />
                  { isExporting ? 'Exporting...' : 'Export' }
                </Button>
              </div>
            </div>
            <div className="overflow-hidden rounded-sm border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {tableHeaders.map((header, index) => (
                        <TableHead key={index} className={`${ index === tableHeaders.length-1 && 'sticky right-0 w-10 bg-white opacity-[0.97] z-10'}`
                          }>{header}</TableHead>
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
                    ) : variants.length > 0 ? (
                      variants.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{UcFirst(item.type)}</TableCell>
                          <TableCell className="sticky right-0 w-10 bg-white opacity-[0.97] z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex size-8 p-0 data-[state=open]:bg-muted">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onSelect={() => setRowAction({ data: item, type: "update" })}>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onSelect={() => setRowAction({ data: item , type: "delete" })}>Delete</DropdownMenuItem>
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
                          No variants found
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
                      <SelectValue placeholder={`${limit}`}/>
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
            <UpdateVariantDialog
              open={rowAction?.type === "update"}
              onOpenChange={() => setRowAction(null)}
              variant={rowAction?.data ?? null}
            />
            <DeleteVariantDialog
             open={rowAction?.type === "delete"}
             onOpenChange={() => setRowAction(null)}
             variant={rowAction?.data ?? null}
             showTrigger={false}
            />
          </CardContent>
        </Card>
      </>
    );
  }
  