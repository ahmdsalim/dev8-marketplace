import { useMutation } from "react-query";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useDeleteUser() {
    return useMutation(
      async (id) => {
        const token = localStorage.getItem("token");
        if (!token) {
        throw new Error("No token found");
        }
        const res = await axios.delete(BASE_URL + "/users/" + id, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      }
    );
};