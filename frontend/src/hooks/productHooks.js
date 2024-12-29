import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  GET_LIST_PRODUCT_URL,
  GET_LIST_PRODUCT_BY_SLUG_URL,
  GET_LIST_PRODUCT_SEARCH_URL,
} from "../service/api";

export const useProducts = (page) => {
  return useQuery(
    ["products", page],
    async () => {
      const res = await axios.get(`${GET_LIST_PRODUCT_URL}?page=${page}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return res.data.data.result;
    },
    {
      keepPreviousData: true,
      onError: (error) => {
        console.error("Error fetching Product data:", error);
      },
    }
  );
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
