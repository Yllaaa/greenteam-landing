"use client";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ToastNot = (message: string): void => {
  toast(message, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export default ToastNot;
