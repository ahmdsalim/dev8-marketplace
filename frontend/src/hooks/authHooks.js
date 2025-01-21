import { useMutation, useQuery, useQueryClient } from "react-query";
import axios from "axios";

import {
  LOGIN_URL,
  REGISTER_URL,
  LOGOUT_URL,
  LOGGED_USER_URL,
  CHANGE_PASSWORD_URL,
  UPDATE_PROFILE_URL,
  FORGOT_PASSWORD_URL,
  RESET_PASSWORD_URL,
  VERIFY_EMAIL_URL,
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
  const queryClient = useQueryClient();
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
        queryClient.clear();
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

export const useAuth = () => {
  const { data, isLoading, isError } = useQuery(
    ["userAuth"],
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
      staleTime: 5 * 60 * 1000,
      retry: 1,
      onError: (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
        }
      },
    }
  );

  return {
    user: data || null,
    role: data?.role || null,
    isLoading,
    isError,
  };
};

// export const useForgotPassword = () => {
//   return useMutation(async (email) => {
//     const res = await axios.post(
//       FORGOT_PASSWORD_URL,
//       { email },
//       {
//         headers: {
//           Accept: "application/json",
//         },
//       }
//     );
//     return res.data;
//   });
// };

export const useForgotPassword = () => {
  return useMutation(async (email) => {
    const res = await axios.post(
      FORGOT_PASSWORD_URL,
      { email },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return res.data;
  });
};

export const useVerifyEmail = () => {
  return useMutation(async (token) => {
    if (!token) {
      throw new Error("No token found");
    }

    const res = await axios.post(
      VERIFY_EMAIL_URL(token),
      {},
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return res.data;
  });
};

export const useResetPassword = () => {
  return useMutation(async (email, password, passwordConfirmation, token) => {
    const res = await axios.post(
      FORGOT_PASSWORD_URL,
      { email, password, passwordConfirmation, token },
      {
        headers: {
          Accept: "application/json",
        },
      }
    );
    return res.data;
  });
};
