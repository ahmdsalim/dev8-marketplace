export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    weekday: "long", // Menampilkan hari dalam format lengkap
    year: "numeric",
    month: "long", // Menampilkan bulan dalam format lengkap
    day: "numeric",
  });
};
