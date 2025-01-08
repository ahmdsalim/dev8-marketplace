import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useAddCategory() {
    return useMutation(
      async (categoryData) => {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        //convert to FormData
        const formData = new FormData();
        formData.append("name", categoryData.name);
        formData.append("description", categoryData.description);

        //subtitute image if exists
        if(categoryData.image && Object.keys(categoryData.image).length > 0){
          formData.append("image", categoryData.image[0]);
        }

        const res = await axios.post(BASE_URL + "/categories", formData, {
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