import { toast } from "react-toastify";


type ToastType = "success" | "error";

export const displayAlert = (
  message: string | string[],
  type: ToastType = "success"
) => {
  const showToast = (text: string) => {
    if (type === "success") {
      toast.success(text);
    } else if (type === "error") {
      toast.error(text);
    }
  };

  if (Array.isArray(message)) {
    message.forEach(showToast);
  } else {
    showToast(message);
  }
};


export const capitalizeFirstLetter = (str: string | null): string => {
  if (!str || str.trim() === "") {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
