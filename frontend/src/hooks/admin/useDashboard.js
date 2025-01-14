import { useQuery } from "react-query";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default function useDashboard() {
  return useQuery(
    ["dashboardData"],
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.get(`${BASE_URL}/getdashboard`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
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
