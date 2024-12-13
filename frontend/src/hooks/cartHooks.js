import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";

import {
  CREATE_CART_ITEMS_URL,
  INCREASE_QTY_ITEM_URL,
  DECREASE_QTY_ITEM_URL,
  GET_CART_ITEMS_URL,
  DELETE_CART_ITEMS_URL,
} from "../service/api";

export const useDecreaseQty = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (itemId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const res = await axios.post(
        DECREASE_QTY_ITEM_URL(itemId),
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("API Response:", res.data);

      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cart");
      },
    }
  );
};

export const useIncreaseQty = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (itemId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      const res = await axios.post(
        INCREASE_QTY_ITEM_URL(itemId),
        {},
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cart");
      },
    }
  );
};

export const addToCart = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ product_id, variant_id, quantity }) => {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        CREATE_CART_ITEMS_URL,
        { product_id, variant_id, quantity },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cartItems");
      },
      onError: (error) => {
        console.error("Can't add to cart", error);
      },
    }
  );
};

export const useCartItems = () => {
  return useQuery(
    "cartItems",
    async () => {
      const token = localStorage.getItem("token");

      const res = await axios.get(GET_CART_ITEMS_URL, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    {
      onError: (error) => {
        console.error("Error fetching carts data:", error);
      },
    }
  );
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (itemId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      try {
        const res = await axios.delete(DELETE_CART_ITEMS_URL(itemId), {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("cartItems");
      },
    }
  );
};
