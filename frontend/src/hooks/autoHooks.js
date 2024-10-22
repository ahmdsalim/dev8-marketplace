import { useMutation } from "react-query";
import axios from "axios";
import { LOGIN_URL, REGISTER_URL, LOGOUT_URL } from "../service/api";

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
      return res.data.data;
    },
    {
      onSuccess: () => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      },
      onError: (error) => {
        console.error("Logout failed", error);
      },
    }
  );
};
