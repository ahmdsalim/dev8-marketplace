/* eslint-disable no-unused-vars */
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader, XSquare } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createProductSchema } from "@/lib/validations";
import useAddProduct from "@/hooks/admin/useAddProduct";
import { useCategory, useCollaboration } from "@/hooks/autoHooks";
import useVariant from "@/hooks/admin/useVariant";
import { useQueryClient } from "react-query";
import { showSuccessToast, showErrorToast } from "@/utils/ToastUtils";

const AddProductDialog = ({ ...props }) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = React.useState(false);
  const { mutate: addProduct, isLoading: isAddingProduct } = useAddProduct();
  const {
    data: categories = [],
    isLoading: isCategoriesLoading,
    error: isCategoriesError,
  } = useCategory();
  const {
    data: collaborations = [],
    isLoading: isCollaborationsLoading,
    error: isCollaborationsError,
  } = useCollaboration();
  const {
    data: variantsData = [],
    isLoading: isVariantsLoading,
    error: isVariantsError,
  } = useVariant();

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createProductSchema),
    defaultValues: {
      variants: [
        {
          id: "",
          stock: "",
          additional_price: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const onSubmit = (data) => {
    setLoading(true);
    addProduct(data, {
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: ["productlist"],
          exact: false,
        });
        reset();
        // eslint-disable-next-line react/prop-types
        props.onOpenChange?.(false);
        showSuccessToast("Product added successfully");
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
          showErrorToast("Failed to add product");
          console.error("Failed to add product", error);
        }
      },
    });
  };

  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-5xl sm:overflow-y-hidden overflow-y-scroll max-h-screen">
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
          <DialogDescription>
            Add a new product to the system.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  {...register("name")}
                  placeholder="product name..."
                />
                {errors.name && (
                  <p className="text-red-500 text-xs italic">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Controller
                  id="category"
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={isCategoriesLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs italic">
                    {errors.category.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  placeholder="product description..."
                />
                {errors.description && (
                  <p className="text-red-500 text-xs italic">
                    {errors.description.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  {...register("price")}
                  defaultValue={0}
                  placeholder="product price..."
                />
                {errors.price && (
                  <p className="text-red-500 text-xs italic">
                    {errors.price.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  {...register("weight")}
                  defaultValue={0}
                  placeholder="product weight (grams)..."
                />
                {errors.weight && (
                  <p className="text-red-500 text-xs italic">
                    {errors.weight.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="images">Images</Label>
                <Input
                  id="images"
                  type="file"
                  {...register("images")}
                  accept="image/png, image/jpg, image/jpeg"
                  multiple
                />
                {errors.images && (
                  <p className="text-red-500 text-xs italic">
                    {errors.images.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="collaboration">
                  Collaboration{" "}
                  <span className="text-slate-500">(Optional)</span>
                </Label>
                <Controller
                  id="collaboration"
                  name="collaboration"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                      disabled={isCollaborationsLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a collaboration" />
                      </SelectTrigger>
                      <SelectContent>
                        {collaborations.map((collaboration) => (
                          <SelectItem
                            key={collaboration.id}
                            value={collaboration.id.toString()}
                          >
                            {collaboration.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.category && (
                  <p className="text-red-500 text-xs italic">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-4 items-start">
              <div className="grid gap-2">
                <Label>Variants</Label>
                {fields.map((item, index) => (
                  <div key={item.id} className="flex flex-col gap-y-2">
                    <div className="flex gap-2">
                      <Controller
                        name={`variants.${index}.id`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                            disabled={isVariantsLoading}
                          >
                            <SelectTrigger className="flex-grow">
                              <SelectValue placeholder="Variant" />
                            </SelectTrigger>
                            <SelectContent>
                              {variantsData.map((variant) => (
                                <SelectItem
                                  key={variant.id}
                                  value={variant.id.toString()}
                                >
                                  {variant.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      <Input
                        type="number"
                        {...register(`variants.${index}.stock`)}
                        placeholder="Stock"
                      />
                      <Input
                        type="number"
                        {...register(`variants.${index}.additional_price`)}
                        placeholder="Add. price"
                      />
                      <Button
                        type="button"
                        onClick={() => fields.length > 1 && remove(index)}
                        variant="outline"
                      >
                        <XSquare />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {errors.variants?.[index]?.id && (
                        <p className="text-red-500 text-xs italic">
                          {errors.variants?.[index]?.id.message},
                        </p>
                      )}
                      {errors.variants?.[index]?.stock && (
                        <p className="text-red-500 text-xs italic">
                          {errors.variants?.[index]?.stock.message},
                        </p>
                      )}
                      {errors.variants?.[index]?.additional_price && (
                        <p className="text-red-500 text-xs italic">
                          {errors.variants?.[index]?.additional_price.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  className="mt-1 justify-self-end"
                  type="button"
                  onClick={() =>
                    append({
                      id: "", // ID default dari data dinamis
                      stock: "",
                      additional_price: "",
                    })
                  }
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              disabled={loading || isAddingProduct}
              onClick={handleSubmit(onSubmit)}
            >
              {loading || isAddingProduct ? (
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

export default AddProductDialog;
