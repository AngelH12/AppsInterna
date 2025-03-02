import { toast, ToastOptions } from "react-toastify";

export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

const basicConfig: ToastOptions = {
  autoClose: 3000,
  theme: "colored",
  icon: false,
  position: "top-right",
  closeButton: false,
};

export const showNotifications = (type: NotificationType, message: string) => {
  switch (type) {
    case NotificationType.SUCCESS:
      return toast.success(message, basicConfig);
    case NotificationType.ERROR:
      return toast.error(message, basicConfig);
    case NotificationType.WARNING:
      return toast.warning(message, basicConfig);
    case NotificationType.INFO:
      return toast.info(message, basicConfig);
    default:
      return toast(message, basicConfig);
  }
};
