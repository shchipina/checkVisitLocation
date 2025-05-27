import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllVisits, getVisitsByRating, getVisitsByLocationType } from "../api/visits/visits";
import { LOCATIONS_TYPES } from "../constants/locationData";
import { useAppSelector } from "../hooks/reduxHook";
import type { Visits } from "../types/visits";

const VisitsList = () => {
  const token = useAppSelector((state) => state.auth.token);

  const [rating, setRating] = useState(0);
  const [locationType, setLocationType] = useState("");
  const [filtersApplied, setFiltersApplied] = useState(false);

  const { data, isLoading, refetch, isFetching, isRefetching, isError } = useQuery<Visits[]>({
    queryKey: ["visits", { rating, locationType, filtersApplied }],
    queryFn: async () => {
      if (!filtersApplied) {
        return await getAllVisits(token!);
      }

      if (rating && locationType) {
        const byType = await getVisitsByLocationType(locationType, token!);
        return byType.filter((visit) => visit.rating === rating);
      }

      if (rating) {
        return await getVisitsByRating(rating, token!);
      }

      if (locationType) {
        return await getVisitsByLocationType(locationType, token!);
      }

      return await getAllVisits(token!);
    },
    enabled: true,
  });

  const handleApplyFilters = () => {
    setFiltersApplied(true);
    refetch();
  };

  const handleResetFilters = () => {
    setRating(0);
    setLocationType("");
    setFiltersApplied(false);
    refetch();
  };

  return (
    <section className="w-full">
      <h3 className="text-xl font-bold text-blue-700">📍 Мої відвідування:</h3>

      <div className="flex flex-col gap-4">
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((r) => (
            <label key={r} className="flex items-center gap-2">
              <input
                type="radio"
                name="rating-filter"
                value={r}
                checked={rating === r}
                onChange={() => setRating(r)}
              />
              {r} ⭐
            </label>
          ))}
          <button
            className="text-sm text-blue-600 underline ml-2"
            onClick={() => setRating(0)}
          >
            Скинути
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Фільтр за типом локації:</h2>
          <select
            className="border p-2 rounded"
            value={locationType}
            onChange={(e) => setLocationType(e.target.value)}
          >
            <option value="">— Оберіть тип —</option>
            {LOCATIONS_TYPES.slice(1).map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleApplyFilters}
          >
            Застосувати фільтри
          </button>
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
            onClick={handleResetFilters}
          >
            Скинути фільтри
          </button>
        </div>
      </div>

      {isLoading || isFetching || isRefetching ? (
        <p>Завантаження...</p>
      ) : isError ? (
        <p className="text-red-500">Помилка при завантаженні даних</p>
      ) : !data?.length ? (
        <p className="text-gray-500">Дані відсутні</p>
      ) : (
        <ul className="space-y-2">
          {data.map((visit) => (
            <li
              key={visit.id}
              className="border border-gray-200 p-4 rounded-md bg-blue-50"
            >
              <p>
                <strong>Локація:</strong> {visit.locationName}
              </p>
              <p>
                <strong>Дата:</strong> {visit.visitDate}
              </p>
              <p>
                <strong>Оцінка:</strong> ⭐ {visit.rating}
              </p>
              <p>
                <strong>Враження:</strong> {visit.impressions}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default VisitsList;
