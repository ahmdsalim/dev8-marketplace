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
  import { formatRupiah } from "@/utils/FormatRupiah";
  import PhotoSlider from "@/components/admin/ImageSlider";
  import useProductList from "@/hooks/admin/useProductList";
  import { useCategory, useCollaboration } from "@/hooks/autoHooks";
  import AddProductDialog from "@/components/admin/AddProductDialog";
  import UpdateProductDialog from "@/components/admin/UpdateProductDialog";
  import DeleteProductDialog from "@/components/admin/DeleteProductDialog";
  import exportData from "@/hooks/admin/exportData";
  import UcFirst from "@/utils/UcFirst";
  
  export default function Products() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [sort, setSort] = useState("latest");
    const [filterCategory, setFilterCategory] = useState("all");
    const [filterCollaboration, setFilterCollaboration] = useState("all");
    const [limit, setLimit] = useState(10);
    const [rowAction, setRowAction] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isExporting, setExporting] = useState();
  
    const {
      data: productData = {},
      isLoading,
      error,
    } = useProductList({ page, searchQuery: debouncedSearch, sortBy: sort, limit, category: filterCategory, collaboration: filterCollaboration });

    const { data: categories = [] } = useCategory();
    const { data: collaborations = [] } = useCollaboration();
  
    const products = productData.result || [];
    const total = productData.total || 0;
  
    const breadcrumbItems = [
      { href: "/dashboard", label: "Dashboard" },
      { label: "Products" },
    ];
    const tableHeaders = ["Product Info", "Price", "Stock", "Sold", ""];
    const sortOptions = [
      { label: "Latest", value: "latest" },
      { label: "Oldest", value: "oldest" },
      { label: "Best Seller", value: "bestseller" },
      { label: "Highest Price", value: "price-highest" },
      { label: "Lowest Price", value: "price-lowest" },
    ];
    const categoryOptions = [
      { label: "All", value: "all" },
      ...categories.map((category) => ({
        label: category.name,
        value: category.id,
      })),
    ];
    const collaborationOptions = [
      { label: "All", value: "all" },
      ...collaborations.map((collaboration) => ({
        label: collaboration.name,
        value: collaboration.id,
      })),
    ];

    const getName = (state, selected) => {
      if (selected === "all") return "All";
      return state.find((v) => v.id === selected)?.name;
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
    
    const handleFilter = (e, type, selected) => {
      if (type === "category"){
        setFilterCategory(selected);
      } else {
        setFilterCollaboration(selected);
      }
    }
  
    const handleLimit = (value) => {
      setLimit(value);
    };
  
    const handleExport = async () => {
      try {
        setExporting(true);
        await exportData("/products/export", "products");
        showSuccessToast("Products exported successfully");
      } catch (error) {
        showErrorToast("Failed to export products");
        console.error("Failed to export products", error);
      } finally {
        setExporting(false);
      }
    };
  
    useEffect(() => {
      setPage(1);
    }, [limit, sort, debouncedSearch, filterCategory, filterCollaboration]);
  
    if (error) {
      toast.error("Failed to fetch products");
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
              List Products
            </h2>
            <div className="text-sm text-slate-500">
              Manage and view all products
            </div>
          </div>
          <div className="flex self-start">
            <Button className="w-full sm:w-auto" size="sm" onClick={() => setIsOpen(true)}>
              Add Product
            </Button>
            { isOpen && (
              <AddProductDialog
                open={isOpen}
                onOpenChange={() => setIsOpen(false)}
              />
            )}
          </div>
        </div>
        <Card>
          <CardContent className="p-6 md:px-8 md:py-10 space-y-4">
            {/* Table Nav */}
            <div className="flex flex-wrap-reverse gap-2 sm:items-center justify-between">
              <div className="flex gap-2 items-center flex-wrap">
                <Input
                  type="search"
                  placeholder="Search products"
                  className="h-8 w-[150px] lg:w-[250px] text-sm"
                  value={search}
                  onChange={handleSearch}
                />
                {/* sort table */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <span className="text-slate-500">Sort By:</span> { UcFirst(sort) }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {sortOptions.map(({ label, value }, index) => (
                      <DropdownMenuItem key={index} onSelect={(e) => handleSort(e, value)}>
                        { label } {sort === value && <Check className="ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* filter table by category */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                    <span className="text-slate-500">Category:</span> { getName(categories, filterCategory) }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {categoryOptions.map(({ label, value }, index) => (
                      <DropdownMenuItem key={index} onSelect={(e) => handleFilter(e, "category", value)}>
                        { label } {filterCategory === value && <Check className="ml-auto" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* filter table by collaboration */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <span className="text-slate-500">Collaboration:</span> { getName(collaborations, filterCollaboration) }
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {collaborationOptions.map(({ label, value }, index) => (
                      <DropdownMenuItem key={index} onSelect={(e) => handleFilter(e, "collaboration", value)}>
                        { label } {filterCollaboration === value && <Check className="ml-auto" />}
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
                          <TableCell>
                            <div className="h-5 bg-slate-200 rounded"></div>
                          </TableCell>
                          <TableCell>
                            <div className="h-5 bg-slate-200 rounded"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : products.length > 0 ? (
                      products.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="sm:w-[350px]">
                            <div className="flex gap-2 items-center">
                              <PhotoSlider
                                images={item.images.map((image) => image.image)}
                                triggerElement="img"
                                className="w-full h-full object-cover rounded group-hover:cursor-pointer"
                                src={item.images[0].image}
                                containerClassName="w-[75px] h-[60px] relative aspect-[4/3] group"
                              />
                              <div className="product__info">
                                <div className="font-semibold">{ String(item.name) }</div>
                                <div className="text-slate-500">{ item.category }</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{ formatRupiah(item.price) }</TableCell>
                          <TableCell>{item.total_stock}</TableCell>
                          <TableCell>{ item.sold }</TableCell>
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
                          No products found
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
            { rowAction?.type === "update" && (
              <UpdateProductDialog
                open={rowAction?.type === "update"}
                onOpenChange={() => setRowAction(null)}
                product={rowAction?.data ?? null}
              />
            )}
            <DeleteProductDialog
             open={rowAction?.type === "delete"}
             onOpenChange={() => setRowAction(null)}
             product={rowAction?.data ?? null}
             showTrigger={false}
            />
          </CardContent>
        </Card>
      </>
    );
  }
  