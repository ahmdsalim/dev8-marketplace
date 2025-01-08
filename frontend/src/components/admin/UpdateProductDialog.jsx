/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader, MoreHorizontal, X } from "lucide-react";
import { formatRupiah } from "@/utils/FormatRupiah";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProductSchema } from "@/lib/validations";
import { useCategory, useCollaboration } from "@/hooks/autoHooks";
import useUpdateProduct from "@/hooks/admin/useUpdateProduct";
import useProductVariantList from "@/hooks/admin/useProductVariantList";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";
import DeleteProductImageDialog from "./DeleteProductImageDialog";
import AddProductVariantDialog from "./AddProductVariantDialog";
import UpdateProductVariantDialog from "./UpdateProductVariantDialog";
import DeleteProductVariantDialog from "./DeleteProductVariantDialog";
import { set } from "date-fns";

const UpdateProductDialog = ({ product, ...props }) => {
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: isCategoriesError,
  } = useCategory();
  const {
    data: collaborations = [],
    isLoading: isCollaborationsLoading,
    error: isCollaborationsError,
  } = useCollaboration();
  const {
    data: productVariants = [],
    isLoading: isProductVariantsLoading,
    error: isProductVariantsError,
  } = useProductVariantList(product?.id);
  const [productUpdateLoading, setProductUpdateLoading] = React.useState(false);
  const { mutate: updateProduct, isLoading: isUpdatingProduct } =
    useUpdateProduct();
  const queryClient = useQueryClient();
  const [images, setImages] = React.useState(product?.images || []);
  const [variantOwned, setVariantOwned] = React.useState(
    product?.variants.map((v) => v.id) || []
  );
  const [rowAction, setRowAction] = React.useState(null);
  const [imageDeleteAction, setImageDeleteAction] = React.useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);

  const tableHeaders = ["Variant", "Stock", "Add. Price", ""];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(updateProductSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category_id?.toString() || "",
      description: product?.description || "",
      price: product?.price || "",
      weight: product?.weight || "",
      collaboration: product?.collaboration_id?.toString() || "",
    },
  });

  React.useEffect(() => {
    reset({
      name: product?.name,
      category: product?.category_id?.toString(),
      description: product?.description,
      price: product?.price,
      weight: product?.weight,
      collaboration: product?.collaboration_id?.toString(),
    });
  }, [product, reset]);

  const handleImageDelete = (deletedImageId) => {
    setImages((prevImages) =>
      prevImages.filter((image) => image.id !== deletedImageId)
    );
  };

  const handleVariantAdd = (variantId) => {
    setVariantOwned((prevVariants) => [...prevVariants, parseInt(variantId)]);
  };

  const handleVariantDelete = (deletedVariantId) => {
    setVariantOwned((prevVariants) =>
      prevVariants.filter((variant) => variant !== deletedVariantId)
    );
  };

  const onSubmit = (data) => {
    const payload = { ...data };

    setProductUpdateLoading(true);
    // Update Logic or hooks
    updateProduct(
      { id: product.id, ...payload },
      {
        onSuccess: async (response) => {
          await queryClient.invalidateQueries({
            queryKey: ["productlist"],
            exact: false,
          });
          reset();
          props.onOpenChange?.(false);
          showSuccessToast(response.message);
          setProductUpdateLoading(false);
        },
        onError: (error) => {
          setProductUpdateLoading(false);
          if (error.response?.data?.data) {
            const validationErrors = error.response.data.data;
            Object.keys(validationErrors).forEach((field) => {
              setError(field, {
                type: "server",
                message: validationErrors[field][0],
              });
            });
          } else {
            showErrorToast("Failed to update product");
            console.error("Failed to update product", error);
          }
        },
      }
    );
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-5xl sm:overflow-y-hidden overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the product information and save it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="product name..."
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  id="category"
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={isCategoriesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs italic">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="product description..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs italic">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price")}
                  defaultValue={0}
                  placeholder="product price..."
                />
                {errors.price && (
                  <p className="text-red-500 text-xs italic">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  {...register("weight")}
                  defaultValue={0}
                  placeholder="product weight (grams)..."
                />
                {errors.weight && (
                  <p className="text-red-500 text-xs italic">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="images">
                  Images <span className="text-slate-500">(Optional)</span>
                </Label>
                <Input
                  id="images"
                  type="file"
                  {...register("images")}
                  accept="image/png, image/jpg, image/jpeg"
                  multiple
                />
                {errors.images && (
                  <p className="text-red-500 text-xs italic">
                    {errors.images.message}
                  </p>
                )}
                <div className="flex gap-2 overflow-x-auto">
                  {images.map((item, index) => (
                    <div key={index} className="relative">
                      <img
                        src={item.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded border shadow-sm"
                      />
                      <button
                        type="button"
                        className="absolute top-0 right-0 p-1 rounded-full disabled:cursor-not-allowed"
                        onClick={() =>
                          setImageDeleteAction({ data: item, isOpen: true })
                        }
                        disabled={isUpdatingProduct || images.length === 2}
                      >
                        <span className="sr-only">Remove image</span>
                        <X className="text-red-500" width={15} height={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collaboration">
                  Collaboration{" "}
                  <span className="text-slate-500">(Optional)</span>
                </Label>
                <Controller
                  id="collaboration"
                  name="collaboration"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={isCollaborationsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collaboration" />
                      </SelectTrigger>
                      <SelectContent>
                        {collaborations.map((collaboration) => (
                          <SelectItem
                            key={collaboration.id}
                            value={collaboration.id.toString()}
                          >
                            {collaboration.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs italic">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <Label>Variants</Label>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  Add Variant
                </Button>
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
                    {isProductVariantsLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
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
                        </TableRow>
                      ))
                    ) : productVariants.length > 0 ? (
                      productVariants
                        .toSorted((a, b) => a.id > b.id)
                        .map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.pivot.stock}</TableCell>
                            <TableCell>
                              {formatRupiah(item.pivot.additional_price)}
                            </TableCell>
                            <TableCell className="sticky right-0 w-10 bg-white opacity-[0.97] z-10">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="flex size-8 p-0 data-[state=open]:bg-muted"
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      setRowAction({
                                        data: item,
                                        type: "update",
                                      })
                                    }
                                  >
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onSelect={() =>
                                      setRowAction({
                                        data: item,
                                        type: "delete",
                                      })
                                    }
                                  >
                                    Delete
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
                          No product variants found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
          {imageDeleteAction && (
            <DeleteProductImageDialog
              open={imageDeleteAction?.isOpen === true}
              onOpenChange={() => setImageDeleteAction(null)}
              productId={product?.id}
              image={imageDeleteAction?.data ?? null}
              showTrigger={false}
              onDeleted={handleImageDelete}
            />
          )}
          {rowAction?.type === "delete" && (
            <DeleteProductVariantDialog
              open={rowAction?.type === "delete"}
              onOpenChange={() => setRowAction(null)}
              productId={product?.id}
              variant={rowAction?.data}
              showTrigger={false}
              onVariantDeleted={handleVariantDelete}
            />
          )}
          <DialogFooter>
            <Button disabled={productUpdateLoading || isUpdatingProduct}>
              {productUpdateLoading || isUpdatingProduct ? (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </form>
        {isAddDialogOpen && (
          <AddProductVariantDialog
            open={isAddDialogOpen}
            onOpenChange={() => setIsAddDialogOpen(false)}
            product={product}
            variantsOwned={variantOwned}
            onVariantAdded={handleVariantAdd}
          />
        )}
        {rowAction?.type === "update" && (
          <UpdateProductVariantDialog
            open={rowAction?.type === "update"}
            onOpenChange={() => setRowAction(null)}
            productId={product?.id}
            variant={rowAction?.data}
            showTrigger={false}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProductDialog;
