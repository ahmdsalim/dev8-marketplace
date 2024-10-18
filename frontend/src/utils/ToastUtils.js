import toast from "react-hot-toast";

export const showSuccessToast = (message) => {
  toast.success(message, {
    position: "top-right",
    duration: 3000,
  });
};

export const showErrorToast = (message) => {
  toast.error(message, {
    position: "top-right",
    duration: 3000,
  });
};

export const showInfoToast = (message) => {
  toast(message, {
    position: "top-right",
    duration: 3000,
  });
};
