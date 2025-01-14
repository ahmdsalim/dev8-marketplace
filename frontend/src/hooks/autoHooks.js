import { useQuery } from "react-query";

import axios from "axios";
import {
  GET_LIST_CATEGORY_URL,
  GET_LIST_COLLABORATION_URL,
} from "../service/api";

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

export const useCollaboration = () => {
  return useQuery(
    "collaborations",
    async () => {
      const res = await axios.get(GET_LIST_COLLABORATION_URL, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data.data.result;
    },
    {
      onError: (error) => {
        console.error("Error fetching collaborations data:", error);
      },
    }
  );
};
