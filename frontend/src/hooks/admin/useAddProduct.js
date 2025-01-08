import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useAddProduct() {
    return useMutation(
      async (productData) => {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        //convert to FormData
        const formData = new FormData();
        formData.append("name", productData.name);
        formData.append("description", productData.description);
        formData.append("price", productData.price);
        formData.append("category", productData.category);
        formData.append("weight", productData.weight);
        
        Array.from(productData.images).forEach((image) => {
          formData.append("images[]", image);
        });

        productData.variants.forEach((variant, index) => {
          formData.append(`variants[${index}][id]`, variant.id);
          formData.append(`variants[${index}][stock]`, variant.stock);
          if (variant.additional_price !== null) {
            formData.append(`variants[${index}][additional_price]`, variant.additional_price);
          }
        });

        if(productData.collaboration) {
          formData.append("collaboration", productData.collaboration);
        }

        const res = await axios.post(BASE_URL + "/products", formData, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            ContentType: "multipart/form-data"
          },
        });

        return res.data.data;
      }
    );
  };