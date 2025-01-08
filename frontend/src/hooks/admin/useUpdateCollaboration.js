import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useUpdateCollaboration() {
    return useMutation(
      async (data) => {
        const id = data.id;
        delete data.id;
        
        const token = localStorage.getItem("token");
        if (!token) {
        throw new Error("No token found");
        }
        const res = await axios.put(BASE_URL + "/collaborations/" + id, data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      }
    );
  };