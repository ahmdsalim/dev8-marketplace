import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useUpdateResiNumber() {
  return useMutation(async ({ orderId, resi_number }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    //convert to FormData
    const formData = new FormData();
    formData.append("resi_number", resi_number);

    const res = await axios.post(BASE_URL + "/data/orders/" + orderId + "/resi-number", formData, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`
      },
      params: {
        _method: "PUT"
      }
    });
    return res.data;
  });
}
