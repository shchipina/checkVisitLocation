import type { VisitData } from "../../types/visitData";
import type { Visits } from "../../types/visits";
import instance from "../instance"

export const getAllVisits = async (): Promise<Visits[]> => {
  const response = await instance.get('/visits', {
    headers: {
      "Accept-Language": "en"
    }
  });
  return response.data
}

export const createVisit = async (formData: VisitData) => {
  const response = await instance.post(
    '/visits',
    formData,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return response.data;
};

export const getVisitsByRating = async (
  ratingValue: number,
): Promise<Visits[]> => {
  const response = await instance.get(`/visits/by-rating?rating=${ratingValue}`);
  return response.data;
}

export const getVisitsByLocationType = async (
  locationType: string,
): Promise<Visits[]> => {
  const response = await instance.get(`/visits/by-location-type?locationTypes=${locationType}`);
  return response.data;
};

export const fetchVisits = async (
  rating: number,
  locationType: string
): Promise<Visits[]> => {
  if (rating && locationType) {
    const byType = await getVisitsByLocationType(locationType);
    return byType.filter((visit) => visit.rating === rating);
  }

  if (rating) return await getVisitsByRating(rating);
  if (locationType) return await getVisitsByLocationType(locationType);

  return await getAllVisits();
};