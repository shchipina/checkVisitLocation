import type { Location } from "../../types/location";
import instance from "../instance";

export const getLocationsByTags = async (tag = ""): Promise<Location[]> => {
  const queryParam = tag === 'ALL' ? '' : tag;
  const response = await instance.get<Location[]>('/locations/by-tags', {
    params: {
      tags: queryParam,
    },
    headers: {
      "Accept-Language": "en"
    }
  });
  return response.data;
};

export const getLocationsByTypes = async (type = ""): Promise<Location[]> => {
  const queryParam = type === 'ALL' ? '' : type;
  const response = await instance.get<Location[]>('/locations/by-types', {
    params: {
      types: queryParam,
    },
    headers: {
      "Accept-Language": "en"
    }
  });
  return response.data;
};


export const fetchLocation = async (): Promise<Location[]> => {
  const response = await instance.get<Location[]>('/locations/by-types?types=');
  return response.data;
};


// export const getLocationsCoords = async (): Promise<{lat: number, lng: number}[]> => {
//   const response = await instance.get<Location[]>('/locations/by-types?types=', {

//     headers: {
//       "Accept-Language": "en"
//     }
//   });
//   return response.data
//     .filter(location => location.geoTag)
//     .map(location => {
//       const [lat, lng] = location.geoTag.split(',').map(Number);

//       return {lat, lng};
//     });
// }