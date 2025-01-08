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
import { changePasswordSchema } from "@/lib/validations";
import { useChangePassword } from "@/hooks/authHooks";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const ChangePasswordDialog = ({ ...props }) => {
  const [loading, setLoading] = React.useState(false);
  const { mutate: changePassword, isLoading: isChangePassword } = useChangePassword();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    changePassword(data, {
      onSuccess: () => {
        reset();
        // eslint-disable-next-line react/prop-types
        props.onOpenChange?.(false);
        showSuccessToast("Successfully changed password");
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
          showErrorToast("Failed to change password");
          console.error("Failed to change password", error);
        }
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="current_password">Current Password</Label>
            <Input
              id="current_password"
              type="password"
              {...register("current_password")}
              placeholder="Current password"
            />
            {errors.current_password && (
              <p className="text-red-500 text-xs italic">
                {errors.current_password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              {...register("new_password")}
              placeholder="New password"
            />
            {errors.new_password && (
              <p className="text-red-500 text-xs italic">
                {errors.new_password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm_password">Confirm Password</Label>
            <Input
              id="confirm_password"
              type="password"
              {...register("confirm_password")}
              placeholder="Confirm password"
            />
            {errors.confirm_password && (
              <p className="text-red-500 text-xs italic">
                {errors.confirm_password.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading || isChangePassword}>
              {loading || isChangePassword ? (
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

export default ChangePasswordDialog;
