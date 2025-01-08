import axios from "axios";
import moment from "moment";

const BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export default async function exportData(endPoint, prefixFileName) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found");
  }
  const res = await axios.get(BASE_URL + endPoint, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: "blob",
  });

  //create url for received file
  const url = window.URL.createObjectURL(new Blob([res.data]));

  //create link element
  const link = document.createElement("a");
  link.href = url;
  const currentDate = moment().format("YYYY-MM-DD");
  const fileName = `${prefixFileName}_${currentDate}.xlsx`;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  //remove link element
  link.parentNode.removeChild(link);
}
