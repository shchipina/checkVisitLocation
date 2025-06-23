import instance from "../instance";

export const getAnalytics = async () => {
  const response = await instance.post("/analytics", {});
  return response.data;
};
