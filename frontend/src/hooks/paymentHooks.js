import { useMutation } from "react-query";
import axios from "axios";

import { CREATE_PAYMENT_DETAIL, CREATE_PAYMENT_REFUND } from "../service/api";

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

export const useRefundOrder = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing");
  }

  return useMutation(async ({ order_id }) => {
    const res = await axios.post(
      CREATE_PAYMENT_REFUND,
      { order_id },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  });
};
