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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateProductVariantSchema } from "@/lib/validations";
import useUpdateProductVariant from "@/hooks/admin/useUpdateProductVariant";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const UpdateProductVariantDialog = ({ variant, productId, ...props }) => {
  const [loading, setLoading] = React.useState(false);
  const { mutate: updateVariant, isLoading: isUpdatingProductVariant } =
    useUpdateProductVariant();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(updateProductVariantSchema),
    defaultValues: {
      stock: variant?.pivot?.stock || "",
      additional_price: variant?.pivot?.additonal_price || "",
    },
  });

  React.useEffect(() => {
    reset({
      stock: variant?.pivot?.stock,
      additonal_price: variant?.pivot?.additonal_price,
    });
  }, [variant, reset]);

  const onSubmit = (data) => {
    // Update Logic or hooks
    setLoading(true);
    updateVariant(
      { productId: productId, variantId: variant.id, ...data },
      {
        onSuccess: async (response) => {
            await queryClient.invalidateQueries({ queryKey: ["productvariantlist"], exact: false });
            reset();
            props.onOpenChange?.(false);
            showSuccessToast(response.message);
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
              showErrorToast("Failed to update variant");
              console.error("Failed to update variant", error);
            }
          },
        }
      );
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Variant { variant?.id }</DialogTitle>
          <DialogDescription>
            Update the variant information and save it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="variant_id">Variant</Label>
            <Input
              id="variant_id"
              value={variant?.name}
              type="text"
              disabled={true}
            />
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
            <Button disabled={loading || isUpdatingProductVariant}>
              {loading || isUpdatingProductVariant ? (
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

export default UpdateProductVariantDialog;
