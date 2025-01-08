/* eslint-disable react/prop-types */
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createProductVariantSchema } from "@/lib/validations";
import useAddProductVariant from "@/hooks/admin/useAddProductVariant";
import useVariant from "@/hooks/admin/useVariant";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const AddProductVariantDialog = ({
  product,
  variantsOwned,
  onVariantAdded,
  ...props
}) => {
  const { data: variantsData = [], isLoading: isVariantsLoading } =
    useVariant();
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const { mutate: addProductVariant, isLoading: isAddingProductVariant } =
    useAddProductVariant();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProductVariantSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    const payload = { productId: product.id, ...data };

    addProductVariant(payload, {
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(["productvariantlist", product?.id]),
          queryClient.invalidateQueries({
            queryKey: ["productlist"],
            exact: false,
          }),
        ]);
        onVariantAdded(payload.variant_id);
        reset();
        props.onOpenChange?.(false);
        showSuccessToast("Variant added successfully");
        setLoading(false);
      },
      onError: (error) => {
        setLoading(false);
        if (error.response?.data?.data) {
          const validationErrors = error.response.data.data;
          Object.keys(validationErrors).forEach((field) => {
            setError(field, {
              type: "server",
              message: validationErrors[field][0],
            });
          });
        } else {
          showErrorToast("Failed to add variant");
          console.error("Failed to add variant", error);
        }
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="truncate">
            Add a variant to {product.name}
          </DialogTitle>
          <DialogDescription>Add a new variant to product.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="variant_id">Variant</Label>
            <Controller
              name="variant_id"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                  disabled={isVariantsLoading}
                >
                  <SelectTrigger id="variant_id" className="flex-grow">
                    <SelectValue placeholder="Select a variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {variantsData.map((variant) => (
                      <SelectItem
                        key={variant.id}
                        value={variant.id.toString()}
                        disabled={variantsOwned.includes(variant.id)}
                      >
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.variant_id && (
              <p className="text-red-500 text-xs italic">
                {errors.variant_id.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              {...register("stock")}
              placeholder="Stock"
            />
            {errors.stock && (
              <p className="text-red-500 text-xs italic">
                {errors.stock.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="additional_price">Additional Price</Label>
            <Input
              id="additional_price"
              type="number"
              {...register("additional_price")}
              placeholder="Additional price"
            />
            {errors.additional_price && (
              <p className="text-red-500 text-xs italic">
                {errors.additional_price.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading || isAddingProductVariant}>
              {loading || isAddingProductVariant ? (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductVariantDialog;
