/* eslint-disable @typescript-eslint/no-explicit-any */
import Cookies from "js-cookie";

export const getToken = (value: any) => {
  return Cookies.get(value) || "";
};
