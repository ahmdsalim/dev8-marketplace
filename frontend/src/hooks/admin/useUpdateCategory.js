import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useUpdateCategory() {
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

    //subtitute image if exists
    if (data.image && Object.keys(data.image).length > 0) {
      formData.append("image", data.image[0]);
    }

    const res = await axios.post(BASE_URL + "/categories/" + id, formData, {
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
