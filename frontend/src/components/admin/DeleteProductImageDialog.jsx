/* eslint-disable react/prop-types */
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
import useDeleteProductImage from "@/hooks/admin/useDeleteProductImage";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const DeleteProductImageDialog = ({
  productId,
  image,
  showTrigger = true,
  onDeleted,
  ...props
}) => {
  const { mutate: deleteProductImage, isLoading: isDeletingProductImage } =
    useDeleteProductImage();

  function onDelete() {
    // Delete Logic or hooks
    deleteProductImage(
      { productId, imageId: image.id },
      {
        onSuccess: (response) => {
          showSuccessToast(response.message);
          onDeleted(image.id);
        },
        onError: (error) => {
          showErrorToast(
            error.response?.data?.message || "Failed to delete image"
          );
          console.error("Failed to delete image", error);
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
            product image from our servers.
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
            disabled={isDeletingProductImage}
          >
            {isDeletingProductImage && (
              <Loader className="mr-2 size-4 animate-spin" aria-hidden="true" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProductImageDialog;
