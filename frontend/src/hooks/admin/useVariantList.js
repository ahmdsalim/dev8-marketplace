import { useQuery } from "react-query";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useVariantList({
  page = null,
  searchQuery = null,
  type = null,
  limit = null,
}) {
  return useQuery(
    ["variantlist", page, searchQuery, type, limit],
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams();

      page && params.append("page", page);
      searchQuery && params.append("search", searchQuery);
      type && params.append("type", type);
      limit && params.append("limit", limit);

      const res = await axios.get(`${BASE_URL}/variants`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params,
      });
      return res.data.data;
    },
    {
      onError: (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
      },
    }
  );
}
