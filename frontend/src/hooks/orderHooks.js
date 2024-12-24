import { useQuery } from "react-query";
import axios from "axios";

import {
  GET_ORDERS_URL,
  GET_ORDER_USER_LOGGED_URL,
  GET_ORDER_BY_ID,
} from "../service/api";

export const useOrders = () => {
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

// export const useOrder = (id) => {
//   const token = localStorage.getItem("token");

//   if (!token) {
//     throw new Error("Token is missing");
//   }
//   return useQuery(
//     ["order", id],
//     async () => {
//       const res = await axios.get(`${GET_ORDER_BY_ID}/${id}`, {
//         headers: {
//           Accept: "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return res.data.result;
//     },
//     {
//       onError: (error) => {
//         console.error("Error fetching order data:", error);
//       },
//     }
//   );
// };

export const useOrder = (id) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token is missing");
  }

  return useQuery(
    ["order", id],
    async () => {
      const res = await axios.get(`${GET_ORDER_BY_ID}/${id}`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    {
      enabled: !!id, // Hanya jalankan query jika ID tersedia
      onError: (error) => {
        console.error("Error fetching order data:", error);
      },
    }
  );
};
