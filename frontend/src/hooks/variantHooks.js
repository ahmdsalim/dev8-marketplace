import { useQuery } from "react-query";
import axios from "axios";

import { GET_LIST_CATEGORY_URL, GET_VARIANTS_URL } from "../service/api";

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
