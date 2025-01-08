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
import { collaborationSchema } from "@/lib/validations";
import useUpdateCollaboration from "@/hooks/admin/useUpdateCollaboration";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const UpdateCollaborationDialog = ({ collaboration, ...props }) => {
  const [loading, setLoading] = React.useState(false);
  const { mutate: updateCollaboration, isLoading: isUpdatingCollaboration } =
    useUpdateCollaboration();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: yupResolver(collaborationSchema),
    defaultValues: {
      name: collaboration?.name || "",
    },
  });

  React.useEffect(() => {
    reset({
      name: collaboration?.name,
    });
  }, [collaboration, reset]);

  const onSubmit = (data) => {
    const payload = { ...data };

    setLoading(true);
    // Update Logic or hooks
    updateCollaboration(
      { id: collaboration.id, ...payload },
      {
        onSuccess: async (response) => {
          await queryClient.invalidateQueries({
            queryKey: ["collaborationlist"],
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
            showErrorToast("Failed to update collaboration");
            console.error("Failed to update collaboration", error);
          }
        },
      }
    );
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Collaboration</DialogTitle>
          <DialogDescription>
            Update the collaboration information and save it.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Brand name..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading || isUpdatingCollaboration}>
              {loading || isUpdatingCollaboration ? (
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

export default UpdateCollaborationDialog;
