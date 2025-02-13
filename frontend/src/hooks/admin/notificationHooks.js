import { useQuery, useMutation } from "react-query";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

const useNotifications = ({ page, searchQuery, type, limit }) => {
  return useQuery(
    ["notifications", page, searchQuery, type, limit],
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

      const res = await axios.get(`${BASE_URL}/notifications`, {
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

const useLatestNotifications = () => {
  return useQuery(
    ["latestnotifications"],
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const params = new URLSearchParams();
      params.append("read", 0);
      params.append("limit", 5);

      const res = await axios.get(`${BASE_URL}/notifications`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      const { result, total } = res.data.data;

      return { result, total };
    },
    {
      onError: (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
      },
      refetchInterval: () => (1000 * 60) * 3
    }
  );
}

const useMarkAsRead = () => {
  return useMutation(
    async (id) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.put(`${BASE_URL}/notifications/${id}/read`, null, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      return res.data.data;
    }
  );
};

const useMarkAllAsRead = () => {
  return useMutation(
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }

      const res = await axios.put(`${BASE_URL}/notifications/mark-as-read`, null, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`
        },
      });

      return res.data.data;
    }
  );
};

export {
  useNotifications,
  useLatestNotifications,
  useMarkAsRead,
  useMarkAllAsRead
}