const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export const LOGIN_URL = `${API_BASE_URL}/auth/login`;
export const REGISTER_URL = `${API_BASE_URL}/auth/register`;
export const LOGGED_USER_URL = `${API_BASE_URL}/auth/user`;
export const LOGOUT_URL = `${API_BASE_URL}/auth/logout`;
export const CHANGE_PASSWORD_URL = `${API_BASE_URL}/auth/user/change-password`;
export const UPDATE_PROFILE_URL = `${API_BASE_URL}/auth/user/update-profile`;

export const GET_USERS_URL = `${API_BASE_URL}/users`;
export const GET_USER_URL = (id) => `${API_BASE_URL}/users/${id}`;
export const CREATE_USER_URL = `${API_BASE_URL}/users`;
export const UPDATE_USER_URL = (id) => `${API_BASE_URL}/users/${id}`;
export const DELETE_USER_URL = (id) => `${API_BASE_URL}/users/${id}`;

export const GET_PRODUCTS_URL = `${API_BASE_URL}/products`;
export const GET_PRODUCT_BY_SLUG_URL = (slug) =>
  `${API_BASE_URL}/products/${slug}`;
export const GET_LIST_PRODUCT_URL = `${API_BASE_URL}/data/products/list`;

export const GET_LIST_PRODUCT_SEARCH_URL = (searchQuery) =>
  `${API_BASE_URL}/data/products/list/?search=${searchQuery}`;

export const GET_LIST_PRODUCT_BY_SLUG_URL = (slug) =>
  `${API_BASE_URL}/data/products/list/${slug}`;
export const CREATE_PRODUCT_URL = `${API_BASE_URL}/products`;
export const UPDATE_PRODUCT_URL = (id) => `${API_BASE_URL}/products/${id}`;
export const DELETE_PRODUCT_URL = (id) => `${API_BASE_URL}/products/${id}`;

export const GET_VARIANTS_URL = `${API_BASE_URL}/variants`;
export const CREATE_VARIANTS_URL = `${API_BASE_URL}/variants`;
export const UPDATE_VARIANTS_URL = (id) => `${API_BASE_URL}/variants/${id}`;

export const GET_CATEGORIES_URL = `${API_BASE_URL}/categories`;
export const GET_CATEGORY_BY_SLUG_URL = (slug) =>
  `${API_BASE_URL}/categories/${slug}`;
export const GET_LIST_CATEGORY_URL = `${API_BASE_URL}/data/categories/list`;
export const CREATE_CATEGORY_URL = `${API_BASE_URL}/categories`;
export const UPDATE_CATEGORY_URL = (id) => `${API_BASE_URL}/categories/${id}`;
export const DELETE_CATEGORY_URL = (id) => `${API_BASE_URL}/categories/${id}`;

export const GET_CART_ITEMS_URL = `${API_BASE_URL}/data/cart/items`;
export const CREATE_CART_ITEMS_URL = `${API_BASE_URL}/data/cart/items/add`;
export const DELETE_CART_ITEMS_URL = (id) =>
  `${API_BASE_URL}/data/cart/items/remove/${id}`;
export const INCREASE_QTY_ITEM_URL = (id) =>
  `${API_BASE_URL}/data/cart/items/increase-qty/${id}`;
export const DECREASE_QTY_ITEM_URL = (id) =>
  `${API_BASE_URL}/data/cart/items/decrease-qty/${id}`;
export const GET_CHECKOUT_ITEMS_URL = `${API_BASE_URL}/data/cart/items/checkout`;

export const GET_ALL_PROVINCES_URL = `${API_BASE_URL}/data/rajaongkir/provinces`;
export const GET_ALL_CITIES_URL = `${API_BASE_URL}/data/rajaongkir/cities`;
export const CHECK_DELIVERY_COST_URL = `${API_BASE_URL}/data/rajaongkir/delivery-cost`;

export const GET_ORDER_USER_LOGGED_URL = `${API_BASE_URL}/data/orders/user/list`;
export const ORDER_CHECKOUT_URL = `${API_BASE_URL}/data/orders/checkout`;
export const GET_ORDERS_URL = `${API_BASE_URL}/data/orders/list`;
export const GET_ORDER_BY_ID = `${API_BASE_URL}/data/orders/list`;

export const CREATE_PAYMENT_DETAIL = `${API_BASE_URL}/webhooks/midtrans`;
export const GET_LIST_COLLABORATION_URL = `${API_BASE_URL}/data/collaborations/list`;