import { useMutation, useQuery } from "react-query";
import axios from "axios";

import {
  GET_CHECKOUT_ITEMS_URL,
  GET_ALL_PROVINCES_URL,
  GET_ALL_CITIES_URL,
  CHECK_DELIVERY_COST_URL,
  ORDER_CHECKOUT_URL,
} from "../service/api";

export const useCheckoutItems = () => {
  return useMutation(async (cartItemId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication token is missing");
    }
    try {
      const res = await axios.post(
        GET_CHECKOUT_ITEMS_URL,
        { cart_item_ids: cartItemId },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error) {
      console.error(error);
    }
  });
};

export const useProvinces = () => {
  return useQuery(
    "provinces",
    async () => {
      const res = await axios.get(GET_ALL_PROVINCES_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },

    {
      onError: (error) => {
        console.error("Error fetching provinces data:", error);
      },
    }
  );
};

export const useCitiesByProvince = (province_id) => {
  return useQuery(
    ["cities", province_id],
    async () => {
      const res = await axios.get(`${GET_ALL_CITIES_URL}/${province_id}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data;
    },
    {
      enabled: !!province_id,
      onError: (error) => {
        console.error("Error fetching cities data:", error);
      },
    }
  );
};

export const useDeliveryCost = (destination, weight, courier) => {
  return useQuery(
    ["delivery_cost", { destination, weight, courier }],
    async () => {
      const res = await axios.post(
        `${CHECK_DELIVERY_COST_URL}`,
        { destination, weight, courier },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return res.data;
    },
    {
      enabled: !!(destination && weight && courier),
      onError: (error) => {
        console.error("Error fetching delivery cost data:", error);
      },
    }
  );
};

export const useCheckout = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing");
  }
  return useMutation(
    async (payload) => {
      const res = await axios.post(`${ORDER_CHECKOUT_URL}`, payload, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    {
      onError: (error) => {
        console.error("Checkout failed:", error);
      },
      onSuccess: (data) => {
        console.log("Checkout successful:", data);
      },
    }
  );
};
