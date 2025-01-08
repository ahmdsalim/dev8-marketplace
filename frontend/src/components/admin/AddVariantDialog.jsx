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
import useAddVariant from "@/hooks/admin/useAddVariant";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const AddVariantDialog = ({ ...props }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const { mutate: addVariant, isLoading: isAddingVariant } = useAddVariant();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(variantSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    addVariant(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["variantlist"],
          exact: false,
        });
        reset();
        // eslint-disable-next-line react/prop-types
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
          <DialogTitle>Add Variant</DialogTitle>
          <DialogDescription>
            Add a new variant to the system. Fill in the details below and click
            save.
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
            <Button disabled={loading || isAddingVariant}>
              {loading || isAddingVariant ? (
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

export default AddVariantDialog;
