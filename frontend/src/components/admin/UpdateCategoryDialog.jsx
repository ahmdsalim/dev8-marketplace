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
import { categorySchema } from "@/lib/validations";
import useUpdateCategory from "@/hooks/admin/useUpdateCategory";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";
import { Textarea } from "@/components/ui/textarea";

const UpdateCategoryDialog = ({ category, ...props }) => {
  const [loading, setLoading] = React.useState(false);
  const { mutate: updateCategory, isLoading: isUpdatingCategory } =
    useUpdateCategory();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      description: category?.description || "",
    },
  });

  React.useEffect(() => {
    reset({
      name: category?.name,
      description: category?.description,
    });
  }, [category, reset]);

  const onSubmit = (data) => {
    const payload = { ...data };

    setLoading(true);
    // Update Logic or hooks
    updateCategory(
      { id: category.id, ...payload },
      {
        onSuccess: async (response) => {
          await queryClient.invalidateQueries({
            queryKey: ["categorylist"],
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
            showErrorToast("Failed to update category");
            console.error("Failed to update category", error);
          }
        },
      }
    );
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category information and save it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Category name..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Category description..."
            />
            {errors.description && (
              <p className="text-red-500 text-xs italic">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="image">
              Image{" "}
              <span className="text-muted-foreground">
                (Fill to change the image)
              </span>
            </Label>
            <Input id="image" type="file" {...register("image")} />
            {errors.image && (
              <p className="text-red-500 text-xs italic">
                {errors.image.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading || isUpdatingCategory}>
              {loading || isUpdatingCategory ? (
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

export default UpdateCategoryDialog;
