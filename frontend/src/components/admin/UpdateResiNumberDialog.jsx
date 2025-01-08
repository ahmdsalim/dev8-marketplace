/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { updateResiNumberSchema } from "@/lib/validations";
import useUpdateResiNumber from "@/hooks/admin/useUpdateResiNumber"
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";
import { useQueryClient } from "react-query";

const UpdateResiNumberDialog = ({
  orderId,
  onResiAdded,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);
  const { mutate: updateResiNumber, isLoading: isUpdatingResiNumber } =
    useUpdateResiNumber();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateResiNumberSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    const payload = { orderId: orderId, ...data };

    updateResiNumber(payload, {
      onSuccess: async (response) => {
        await queryClient.invalidateQueries({ queryKey: ["listorder"], exact: false });
        onResiAdded(response.data.resi_number);
        reset();
        props.onOpenChange?.(false);
        showSuccessToast("Resi number updated successfully");
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
          showErrorToast("Failed to update resi number");
          console.error("Failed to update resi number", error);
        }
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="truncate">
            Update resi number
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="resi_number">Resi Number</Label>
            <Input
              id="resi_number"
              type="text"
              {...register("resi_number")}
              placeholder="Resi Number"
            />
            {errors.resi_number && (
              <p className="text-red-500 text-xs italic">
                {errors.resi_number.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading || isUpdatingResiNumber}>
              {loading || isUpdatingResiNumber ? (
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

export default UpdateResiNumberDialog;
