import { useMutation, useQuery, useQueryClient } from "react-query";
import { useState, useEffect } from "react";

import axios from "axios";
import {
  LOGIN_URL,
  REGISTER_URL,
  LOGOUT_URL,
  LOGGED_USER_URL,
  CHANGE_PASSWORD_URL,
  UPDATE_PROFILE_URL,
  GET_LIST_PRODUCT_URL,
  GET_LIST_PRODUCT_BY_SLUG_URL,
  GET_LIST_PRODUCT_SEARCH_URL,
  GET_CATEGORIES_URL,
  GET_LIST_CATEGORY_URL,
  CREATE_CART_ITEMS_URL,
  GET_VARIANTS_URL,
  INCREASE_QTY_ITEM_URL,
  DECREASE_QTY_ITEM_URL,
  GET_CART_ITEMS_URL,
  DELETE_CART_ITEMS_URL,
  GET_CHECKOUT_ITEMS_URL,
  GET_ALL_PROVINCES_URL,
  GET_ALL_CITIES_URL,
  CHECK_DELIVERY_COST_URL,
  ORDER_CHECKOUT_URL,
} from "../service/api";

export const useRegister = () => {
  return useMutation(
    async (userData) => {
      const res = await axios.post(REGISTER_URL, userData, {
        headers: {
          Accept: "application/json",
        },
      });
      return res.data.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
      },
      onError: (error) => {
        console.error("Register failed", error);
      },
    }
  );
};

export const useLogin = () => {
  return useMutation(
    async (userData) => {
      const res = await axios.post(LOGIN_URL, userData, {
        headers: {
          Accept: "application/json",
        },
      });
      return res.data.data;
    },
    {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
      },
      onError: (error) => {
        console.error("Login failed", error);
      },
    }
  );
};

export const useLogout = () => {
  return useMutation(
    async () => {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        LOGOUT_URL,
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
        localStorage.removeItem("token");
      },
      onError: (error) => {
        console.error("Logout failed", error);
      },
    }
  );
};

export const useUser = () => {
  return useQuery(
    "user",
    async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.get(LOGGED_USER_URL, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    {
      onError: (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
      },
    }
  );
};

export const useChangePassword = () => {
  return useMutation(
    async ({ current_password, new_password, confirm_password }) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found");
      }
      const res = await axios.put(
        CHANGE_PASSWORD_URL,
        { current_password, new_password, confirm_password },
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    }
  );
};

export const useChangeProfile = () => {
  return useMutation(async ({ name, username, email, phone }) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }
    const res = await axios.put(
      UPDATE_PROFILE_URL,
      { name, username, email, phone },
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

export const useProducts = () => {
  return useQuery("products", async () => {
    const res = await axios.get(GET_LIST_PRODUCT_URL, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data.data.result;
  });
};

export const useProductSearch = (searchQuery) => {
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return useQuery(
    ["products", debouncedSearchQuery],
    async () => {
      const res = await axios.get(
        GET_LIST_PRODUCT_SEARCH_URL(debouncedSearchQuery)
      );
      return res.data.data.result;
    },
    {
      enabled: !!debouncedSearchQuery,
    }
  );
};

export const useProduct = (slug) => {
  return useQuery(
    ["product", slug],
    async () => {
      const res = await axios.get(GET_LIST_PRODUCT_BY_SLUG_URL(slug), {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data.data;
    },
    {
      onError: (error) => {
        console.error("Error fetching product data:", error);
      },
    }
  );
};

export const useCategory = () => {
  return useQuery(
    "categories",
    async () => {
      const res = await axios.get(GET_LIST_CATEGORY_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data.data.result;
    },
    {
      onError: (error) => {
        console.error("Error fetching category data:", error);
      },
    }
  );
};

export const useVariant = () => {
  return useQuery(
    "variants",
    async () => {
      const res = await axios.get(GET_VARIANTS_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data.result;
    },
    {
      onError: (error) => {
        console.error("Error fetching variants data:", error);
      },
    }
  );
};

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
