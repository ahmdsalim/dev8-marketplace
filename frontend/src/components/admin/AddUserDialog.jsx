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
import { createUserSchema } from "@/lib/validations";
import useAddUser from "@/hooks/admin/useAddUser";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const AddUserDialog = ({ ...props }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const { mutate: addUser, isLoading: isAddingUser } = useAddUser();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createUserSchema),
  });

  const onSubmit = (data) => {
    setLoading(true);
    addUser(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["userlist"],
          exact: false,
        });
        reset();
        // eslint-disable-next-line react/prop-types
        props.onOpenChange?.(false);
        showSuccessToast("User added successfully");
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
          showErrorToast("Failed to add user");
          console.error("Failed to add user", error);
        }
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add User</DialogTitle>
          <DialogDescription>
            Add a new user to the system. Fill in the details below and click
            save.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Enter name..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              {...register("username")}
              placeholder="Enter username..."
            />
            {errors.username && (
              <p className="text-red-500 text-xs italic">
                {errors.username.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              {...register("email")}
              placeholder="Enter email..."
            />
            {errors.email && (
              <p className="text-red-500 text-xs italic">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              placeholder="Enter password..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="number"
              {...register("phone")}
              placeholder="Enter phone..."
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">
                {errors.phone.message}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button disabled={loading || isAddingUser}>
              {loading || isAddingUser ? (
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

export default AddUserDialog;
