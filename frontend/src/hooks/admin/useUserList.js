import { useQuery } from "react-query";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useUserList({ page, searchQuery, sortBy, limit }) {
    return useQuery(
      ["userlist" , page, searchQuery, sortBy, limit],
      async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found");
        }

        const params = new URLSearchParams();

        page && params.append("page", page);
        searchQuery && params.append("search", searchQuery);
        sortBy && params.append("sortby", sortBy);
        limit && params.append("limit", limit);

        const res = await axios.get(`${BASE_URL}/users`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          params
        });
        return res.data.data;
      },
      {
        onError: (error) => {
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
          }
        },
        refetchOnWindowFocus: false
      }
    );
};