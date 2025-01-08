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
import { variantSchema } from "@/lib/validations";
import useUpdateVariant from "@/hooks/admin/useUpdateVariant";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const UpdateVariantDialog = ({ variant, ...props }) => {
  const [loading, setLoading] = React.useState(false);
  const { mutate: updateVariant, isLoading: isUpdatingVariant } =
    useUpdateVariant();
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(variantSchema),
    defaultValues: {
      name: variant?.name || "",
      type: variant?.type || "",
    },
  });

  React.useEffect(() => {
    reset({
      name: variant?.name,
      type: variant?.type,
    });
  }, [variant, reset]);

  const onSubmit = (data) => {
    const payload = { ...data };

    setLoading(true);
    // Update Logic or hooks
    updateVariant(
      { id: variant.id, ...payload },
      {
        onSuccess: async (response) => {
          await queryClient.invalidateQueries({
            queryKey: ["variantlist"],
            exact: false,
          });
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
          <DialogTitle>Edit Variant</DialogTitle>
          <DialogDescription>
            Update the variant information and save it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Variant Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Variant name..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pakaian">Pakaian</SelectItem>
                    <SelectItem value="celana">Celana</SelectItem>
                    <SelectItem value="sepatu">Sepatu</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.type && (
              <p className="text-red-500 text-xs italic">
                {errors.type.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading || isUpdatingVariant}>
              {loading || isUpdatingVariant ? (
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

export default UpdateVariantDialog;
