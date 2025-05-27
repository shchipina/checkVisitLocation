import { useMemo, useState } from "react";
import Header from "../components/Header"
import { useAppSelector } from "../hooks/reduxHook";
import { LOCATION_TAGS, LOCATIONS_TYPES } from "../constants/locationData";
import cn from "classnames";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import LocationCard from "../components/LocationCard";
import { getLocationsByTags, getLocationsByTypes } from "../api/locations/locations";

function HomePage() {
  const [locationType, setLocationType] = useState('');
  const [locationTag, setLocationTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const token = useAppSelector(state => state.auth.token);
  const itemsPerPage = 12;

  const { data: locationsByType = [], isLoading: loadingType } = useQuery({
    queryKey: ['locationsByType', locationType],
    queryFn: () => getLocationsByTypes(locationType, token),
    placeholderData: keepPreviousData,
  });

  const { data: locationsByTag = [], isLoading: loadingTag } = useQuery({
    queryKey: ['locationsByTag', locationTag],
    queryFn: () => getLocationsByTags(locationTag, token),
    enabled: !!locationTag,
    placeholderData: keepPreviousData,
  });

  const isLoading = loadingType || loadingTag;

  const filteredLocations = useMemo(() => {
    if (locationTag) {
      const idsFromType = new Set(locationsByType.map(loc => loc.id));
      return locationsByTag.filter(loc => idsFromType.has(loc.id));
    }
    return locationsByType;
  }, [locationsByTag, locationsByType, locationTag]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

  return (
    <main className="max-w-[1200px] mx-auto">
      <section className="flex justify-between">
        <ul className="flex flex-wrap gap-3 justify-center my-6">
          {LOCATIONS_TYPES.map(type => (
            <li
              key={type}
              onClick={() => {
                setLocationType(type === 'ALL' ? '' : type);
                setCurrentPage(1);
              }}
              className={cn(
                'cursor-pointer px-4 py-2 border rounded-full text-sm font-medium transition duration-200',
                (locationType === '' && type === 'ALL') || locationType === type
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
              )}
            >
              {type}
            </li>
          ))}
        </ul>

        <div className="flex justify-center my-6">
          <select
            value={locationTag}
            onChange={(e) => {
              setLocationTag(e.target.value);
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded-md px-4 py-2"
          >
            <option value="">Filter by Tag (optional)</option>
            {LOCATION_TAGS
              .filter(tag => tag.type !== 'ALL')
              .map(tag => (
                <option key={tag.id} value={tag.type}>
                  {tag.type}
                </option>
              ))}
          </select>
        </div>
      </section>

      {isLoading && (
        <div className="flex justify-center items-center my-10">
          <p className="text-xl text-gray-500">Завантаження...</p>
        </div>
      )}

      {!isLoading && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-6">
          {currentLocations.length === 0 && (<p className="text-xl text-gray-500">
            Дані відсутні
          </p>)
          }
          {currentLocations.map(location => (
            <LocationCard key={location.id} location={location} />
          ))}
        </section>
      )}

      {!isLoading && totalPages > 1 && (
        <div className="flex justify-center gap-2 my-10">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentPage(i + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={cn(
                'px-4 py-2 border rounded-md text-sm font-medium transition',
                currentPage === i + 1
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}

export default HomePage