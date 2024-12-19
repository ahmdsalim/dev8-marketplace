import { useQuery } from "react-query";
import axios from "axios";

import { GET_ORDERS_URL, GET_ORDER_USER_LOGGED_URL } from "../service/api";

export const useOrder = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing");
  }
  return useQuery(
    "orders",
    async () => {
      const res = await axios.get(GET_ORDER_USER_LOGGED_URL, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data.data.result;
    },
    {
      onError: (error) => {
        console.error("Error fetching order data:", error);
      },
    }
  );
};
