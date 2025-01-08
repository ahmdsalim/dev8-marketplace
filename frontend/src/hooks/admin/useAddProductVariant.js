import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useAddProductVariant() {
    return useMutation(
      async (data) => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("No token found");
        }

        //convert to FormData
        const formData = new FormData();
        formData.append("variant_id", data.variant_id);
        formData.append("stock", data.stock);

        if(data.additional_price !== null) {
          formData.append("additional_price", data.additional_price);
        }

        const res = await axios.post(BASE_URL + "/products/" + data.productId + "/variants", formData, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.data;
      }
    );
  };