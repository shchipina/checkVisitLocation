import type { Visits } from "../../types/visits";
import instance from "../instance"

export const getAllVisits = async (token: { token: string }): Promise<Visits[]> => {
  const response = await instance.get('/visits', {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept-Language": "en"
    }
  });
  return response.data
}

export const createVisit = async (formData, token) => {
  const response = await instance.post(
    '/visits',
    formData,
    {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};


export const getVisitsByRating = async () => { }

export const getVisitsByLocationType = async () => { }