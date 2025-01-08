export const formatRupiah = (value, options = {}) => {
  const defaultOptions = {
    style: "currency",
    currency: "IDR",
  };

  const finalOptions = { ...defaultOptions, ...options };

  return new Intl.NumberFormat("id-ID", finalOptions).format(value);
};
