/* eslint-disable react/prop-types */
import React from "react";
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
import useDeleteProductVariant from "@/hooks/admin/useDeleteProductVariant";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";
import { useQueryClient } from "react-query";

const DeleteProductVariantDialog = ({
  productId,
  variant,
  showTrigger = true,
  onVariantDeleted,
  ...props
}) => {
  const [loading, setLoading] = React.useState(false);
  const { mutate: deleteProductVariant, isLoading: isDeletingProductVariant } =
    useDeleteProductVariant();
  const queryClient = useQueryClient();

  function onDelete() {
    setLoading(true);
    // Delete Logic or hooks
    deleteProductVariant(
      { productId, variantId: variant.id },
      {
        onSuccess: async (response) => {
          onVariantDeleted(variant.id);
          await Promise.all([
            queryClient.invalidateQueries(["productvariantlist", productId]),
            queryClient.invalidateQueries({
              queryKey: ["productlist"],
              exact: false,
            }),
          ]);
          showSuccessToast(response.message);
          setLoading(false);
        },
        onError: (error) => {
          setLoading(false);
          showErrorToast(
            error.response?.data?.message || "Failed to delete variant"
          );
          console.error("Failed to delete variant", error);
        },
        onSettled: () => {
          props.onOpenChange?.(false);
        },
      }
    );
  }

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
            This action cannot be undone. This will permanently delete your
            product variant from our servers.
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
            disabled={loading || isDeletingProductVariant}
          >
            {loading || isDeletingProductVariant ? (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            ) : null}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductVariantDialog;
