import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useAddCollaboration() {
    return useMutation(
      async (data) => {
        const token = localStorage.getItem("token");
        if (!token) {
        throw new Error("No token found");
        }
        const res = await axios.post(BASE_URL + "/collaborations", data, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data.data;
      }
    );
  };