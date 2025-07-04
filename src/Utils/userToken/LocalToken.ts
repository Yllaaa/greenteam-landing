export const getToken = () => {
  if (typeof window !== "undefined") {
    const storage =
      localStorage.getItem("user") === null
        ? ""
        : localStorage.getItem("user") || "";
    return localStorage.getItem("user") === null ? "" : JSON.parse(storage);
  }
  return "";
};
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};
