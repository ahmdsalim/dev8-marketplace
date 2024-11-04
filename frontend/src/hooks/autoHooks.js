import { useMutation, useQuery } from "react-query";
import axios from "axios";
import {
  LOGIN_URL,
  REGISTER_URL,
  LOGOUT_URL,
  LOGGED_USER_URL,
  CHANGE_PASSWORD_URL,
  UPDATE_PROFILE_URL,
  GET_LIST_PRODUCT_URL,
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
