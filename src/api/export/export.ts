import instance from "../instance"

export const exportData = async (format: string, token: string) => {
  const response = await instance.get(`/export/${format}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
     responseType: "blob",
  });

  return response.data;
};
