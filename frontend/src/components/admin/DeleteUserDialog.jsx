/* eslint-disable react/prop-types */
import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Loader, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { useQueryClient } from "react-query";
import useDeleteUser from "@/hooks/admin/useDeleteUser";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const DeleteUserDialog = ({ user, showTrigger = true, ...props }) => {
  const [loading, setLoading] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 640px)");
  const { mutate: deleteUser, isLoading: isDeletingUser } = useDeleteUser();
  const queryClient = useQueryClient();
  function onDelete() {
    setLoading(true);
    // Delete Logic or hooks
    deleteUser(user.id, {
      onSuccess: async (response) => {
        await queryClient.invalidateQueries({
          queryKey: ["userlist"],
          exact: false,
        });
        showSuccessToast(response.message);
        setLoading(false);
      },
      onError: (error) => {
        setLoading(false);
        showErrorToast(
          error.response?.data?.message || "Failed to delete user"
        );
        console.error("Failed to delete user", error);
      },
      onSettled: () => {
        props.onOpenChange?.(false);
      },
    });
  }

  if (isDesktop) {
    return (
      <Dialog {...props}>
        {showTrigger ? (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Trash className="mr-2 size-4" aria-hidden="true" />
              Delete (1)
            </Button>
          </DialogTrigger>
        ) : null}
        <DialogContent>
          <DialogHeader className="space-y-4">
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your{" "}
              <span className="font-medium">1</span>
              user from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              aria-label="Delete selected rows"
              variant="destructive"
              onClick={onDelete}
              disabled={loading || isDeletingUser}
            >
              {loading || isDeletingUser ? (
                <Loader
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : null}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      {showTrigger ? (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Trash className="mr-2 size-4" aria-hidden="true" />
            Delete (1)
          </Button>
        </DrawerTrigger>
      ) : null}
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Are you absolutely sure?</DrawerTitle>
          <DrawerDescription>
            This action cannot be undone. This will permanently delete your{" "}
            <span className="font-medium">1</span>
            user from our servers.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
          <Button
            aria-label="Delete selected rows"
            variant="destructive"
            onClick={onDelete}
            disabled={loading || isDeletingUser}
          >
            {loading || isDeletingUser ? (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Delete
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default DeleteUserDialog;
