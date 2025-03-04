export const getToken = () => {
  if (typeof window !== "undefined") {
    const storage = localStorage.getItem("user") || "";
    return JSON.parse(storage);
  }
  return "";
};
