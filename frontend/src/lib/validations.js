import * as y from "yup";

export const createUserSchema = y.object({
  email: y.string().required("Email is required").email("Invalid email format"),
  name: y.string().required("Name is required"),
  username: y.string().required("Username is required"),
  password: y
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  phone: y
    .string()
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
});

export const updateUserSchema = y.object({
  email: y.string().required("Email is required").email("Invalid email format"),
  name: y.string().required("Name is required"),
  username: y.string().required("Username is required"),
  password: y
    .string()
    .nullable() // Allow null or empty string
    .test(
      "password-length", // Unique test name
      "Password must be at least 6 characters", // Error message
      (value) => {
        if (!value) return true; // Skip validation if password is empty
        return value.length >= 6; // Validate minimum length
      }
    ),
  phone: y
    .string()
    .matches(/^[0-9]+$/, "Phone number must only contain digits")
    .min(10, "Phone number must be at least 10 digits")
    .required("Phone number is required"),
});

export const categorySchema = y.object({
  name: y.string().required("Name is required"),
  description: y.string().required("Description is required"),
  image: y
    .mixed()
    .test("imageFormat", "Image must be type of png, jpg, jpeg", (value) => {
      if (value && Object.keys(value).length !== 0) {
        const mimesType = ["png", "jpg", "jpeg"];
        return mimesType.includes(value[0].name.split(".").pop());
      }
      return true;
    })
    .test("imageSize", "Image size must be less than 2MB", (value) => {
      if (!value.length) {
        // image is optional
        return true;
      }
      return value[0].size <= 2000000;
    }),
});

export const collaborationSchema = y.object({
  name: y.string().required("Name is required"),
});

export const variantSchema = y.object({
  name: y.string().required("Name is required"),
  type: y.string().required("Type is required"),
});

export const createProductSchema = y.object({
  name: y.string().required("Name is required"),
  description: y.string().required("Description is required"),
  price: y
    .number()
    .required("Price is required")
    .test("price", "Price must be greater than 0", (value) => value > 0),
  category: y.string().required("Category is required"),
  weight: y
    .number()
    .required("Weight is required")
    .test("weight", "Weight must be greater than 0", (value) => value > 0),
  images: y
    .mixed()
    .required("Images is required")
    .test("minimumImages", "Minimum 2 image is required", (value) => {
      return Object.keys(value).length >= 2;
    })
    .test("imageFormat", "Images must be type of png, jpg, jpeg", (value) => {
      if (!value) return false;
      const filesArray = Object.values(value);

      const mimesType = ["png", "jpg", "jpeg"];
      return filesArray.every((file) => {
        const fileExtension = file?.name?.split(".").pop().toLowerCase();
        return mimesType.includes(fileExtension);
      });
    })
    .test("imageSize", "Each image size must be less than 2MB", (value) => {
      if (!value) return false;
      const filesArray = Object.values(value);

      return filesArray.every((file) => file?.size <= 2000000);
    }),
  variants: y
    .array()
    .of(
      y.object().shape({
        id: y.string().required("Variant is required"),
        stock: y
          .number()
          .typeError("Stok is required")
          .required("Stock is required")
          .min(1, "Stock must be at least 1"),
        additional_price: y.mixed().nullable(),
      })
    )
    .required("At least one variant is required"),
  collaboration: y.string().nullable(),
});

export const updateProductSchema = y.object({
  name: y.string().required("Name is required"),
  description: y.string().required("Description is required"),
  price: y
    .number()
    .required("Price is required")
    .test("price", "Price must be greater than 0", (value) => value > 0),
  category: y.string().required("Category is required"),
  weight: y
    .number()
    .required("Weight is required")
    .test("weight", "Weight must be greater than 0", (value) => value > 0),
  images: y
    .mixed()
    .nullable()
    .test("imageFormat", "Images must be type of png, jpg, jpeg", (value) => {
      if (!value) return false;
      const filesArray = Object.values(value);

      const mimesType = ["png", "jpg", "jpeg"];
      return filesArray.every((file) => {
        const fileExtension = file?.name?.split(".").pop().toLowerCase();
        return mimesType.includes(fileExtension);
      });
    })
    .test("imageSize", "Each image size must be less than 2MB", (value) => {
      if (!value) return false;
      const filesArray = Object.values(value);

      return filesArray.every((file) => file?.size <= 2000000);
    }),
  collaboration: y.string().nullable(),
});

export const createProductVariantSchema = y.object({
  variant_id: y.string().required("Variant is required"),
  stock: y
    .number()
    .typeError("Stok is required")
    .required("Stock is required")
    .min(1, "Stock must be at least 1"),
  additional_price: y.mixed().nullable(),
});

export const updateProductVariantSchema = y.object({
  stock: y
    .number()
    .typeError("Stok is required")
    .required("Stock is required")
    .min(1, "Stock must be at least 1"),
  additional_price: y.mixed().nullable(),
});

export const changePasswordSchema = y.object().shape({
  current_password: y.string().required("Current Password is required"),
  new_password: y
    .string()
    .min(8, "New Password must be at least 8 characters")
    .required("New Password is required"),
  confirm_password: y
    .string()
    .oneOf([y.ref("new_password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export const updateResiNumberSchema = y.object().shape({
  resi_number: y.string().required("Resi Number is required"),
});