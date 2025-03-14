export const getToken = () => {
  if (typeof window !== "undefined") {
    const storage = localStorage.getItem("user") || "";
    return JSON.parse(storage);
  }
  return "";
};
export const removeToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};
