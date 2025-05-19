import type { Location } from "../../types/location";
import instance from "../instance";

export const getLocationsByTags = async (
  tag = "", token: { token: string }
): Promise<Location[]> => {
  const queryParam = tag === 'ALL' ? '' : tag;
  const response = await instance.get<Location[]>('/locations/by-tags', {
    params: {
      tags: queryParam,
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept-Language": "en"
    }
  });
  return response.data;
};

export const getLocationsByTypes = async (
  type = "", token: { token: string }
): Promise<Location[]> => {
  const queryParam = type === 'ALL' ? '' : type;
  const response = await instance.get<Location[]>('/locations/by-types', {
    params: {
      types: queryParam,
    },
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept-Language": "en"
    }
  });
  return response.data;
};


export const fetchLocation = async (token) => {
  const response = await instance.get('/locations/by-types?types=', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
} 