import instance from "../instance"

export const exportData = async (format: string) => {
  const response = await instance.get(`/export/${format}`, {
     responseType: "blob",
  });

  return response.data;
};
