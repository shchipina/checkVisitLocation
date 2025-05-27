import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchVisits } from "../api/visits/visits";
import { LOCATIONS_TYPES } from "../constants/locationData";
import type { Visits } from "../types/visits";
import { IoLocationOutline } from "react-icons/io5";
import { CiStar } from "react-icons/ci";
import { FaStar } from "react-icons/fa";

const VisitsList = () => {

  const [rating, setRating] = useState(0);
  const [locationType, setLocationType] = useState("");

  const { data, isLoading, refetch, isFetching, isRefetching, isError } = useQuery<Visits[]>({
    queryKey: ["visits", { rating, locationType }],
    queryFn: () => fetchVisits(rating, locationType)
  });

  const handleResetFilters = () => {
    setRating(0);
    setLocationType("");
    refetch();
  };

  return (
    <section className="w-full">
      <h3 className="text-xl font-bold text-[#333] mb-4">
        <IoLocationOutline className="inline" /> Мої відвідування:
      </h3>

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
                className="cursor-pointer"
              />
              {r}
              {rating === r
                ? <FaStar className="inline text-yellow-400" />
                : <CiStar className="inline" />
              }
            </label>
          ))}
          <button
            className="text-sm text-blue-600 underline ml-2 cursor-pointer"
            onClick={() => setRating(0)}
          >
            Скинути
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">
            Фільтр за типом локації:
          </h2>
          <select
            className="border p-2 rounded cursor-pointer"
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
        <button
          className="cursor-pointer"
          onClick={handleResetFilters}
        >
          Скинути всі фільтри
        </button>

      </div>

      {isLoading || isFetching || isRefetching ? (
        <p>Завантаження...</p>
      ) : isError ? (
        <p className="text-red-500">Помилка при завантаженні даних</p>
      ) : !data?.length ? (
        <p className="text-gray-500">Дані відсутні</p>
      ) : (
        <ul className="space-y-3 mt-5">
          {data.map((visit) => (
            <li
              key={visit.id}
              className="p-4 rounded-md bg-blue-50"
            >
              <p>
                <strong>Локація:</strong> {visit.locationName}
              </p>
              <p>
                <strong>Дата:</strong> {visit.visitDate}
              </p>
              <p className="flex items-center">
                <strong>Оцінка:</strong>
                <FaStar className="inline text-yellow-400 mx-1" />
                {visit.rating}
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
