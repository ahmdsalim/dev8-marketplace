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
import useAddCollaboration from "@/hooks/admin/useAddCollaboration";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const AddCollaborationDialog = ({ ...props }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const { mutate: addCollaboration, isLoading: isAddingCollaboration } =
    useAddCollaboration();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(collaborationSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    addCollaboration(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["collaborationlist"],
          exact: false,
        });
        reset();
        // eslint-disable-next-line react/prop-types
        props.onOpenChange?.(false);
        showSuccessToast("Collaboration added successfully");
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
          showErrorToast("Failed to add collaboration");
          console.error("Failed to add collaboration", error);
        }
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Collaboration</DialogTitle>
          <DialogDescription>
            Add a new collaboration to the system. Fill in the details below and
            click save.
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
            <Button disabled={loading || isAddingCollaboration}>
              {loading || isAddingCollaboration ? (
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

export default AddCollaborationDialog;
