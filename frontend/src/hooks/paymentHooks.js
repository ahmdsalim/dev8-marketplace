import { useMutation } from "react-query";
import axios from "axios";

import { CREATE_PAYMENT_DETAIL } from "../service/api";

export const useCheckout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing");
  }
  return useMutation(
    async (payload) => {
      const res = await axios.post(`${CREATE_PAYMENT_DETAIL}`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    {
      onError: (error) => {
        console.error("Payment failed:", error);
      },
    }
  );
};
