import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useUpdateProduct() {
  return useMutation(async (data) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const id = data.id;

    //convert to FormData
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category", data.category);
    formData.append("weight", data.weight);

    Array.from(data.images).forEach((image) => {
      formData.append("images[]", image);
    });

    if(data.collaboration) {
      formData.append("collaboration", data.collaboration);
    }

    const res = await axios.post(BASE_URL + "/products/" + id, formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        ContentType: "multipart/form-data"
      },
      params: {
        _method: "PUT"
      }
    });
    return res.data;
  });
}
