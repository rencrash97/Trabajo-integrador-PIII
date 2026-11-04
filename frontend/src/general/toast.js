import { Bounce, toast } from "react-toastify";

const defaultNotificationConfig = {
    position: "top-right",
    autoclose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce
}

export const errorToast = (message, config) =>
    toast.error(message, {
        ...defaultNotificationConfig,
        ...config
    })

export const successToast = (message, config) =>
    toast.success(message, {
        ...defaultNotificationConfig,
        ...config
    })