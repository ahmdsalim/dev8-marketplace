import { useMutation } from "react-query";
import axios from "axios";
import { LOGIN_URL, REGISTER_URL } from "../service/api";

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
