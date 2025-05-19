import type { Location } from "../types/location";
import FavoriteButton from "./FavoriteButton";

function LocationCard({ location }: {location: Location}) {
  const { name, description, address, geoTag, tags, type, visitCount } = location;

  return (
    <div className="flex flex-col justify-between bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-300 h-80 max-h-80 min-h-80">
      <div>
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-gray-800 truncate">{name}</h2>
          <p className="text-xs text-gray-500">{type}</p>
        </div>

        <p className="text-sm text-gray-700 mb-3 line-clamp-1">{description}</p>

        <div className="mb-3 text-sm text-gray-600 space-y-1">
          <p><strong>Адреса:</strong> {address}</p>
          <p><strong>Координати:</strong> {geoTag}</p>
          <p><strong>Відвідувань:</strong> {visitCount}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-2 max-h-12 overflow-hidden">
          {tags.slice(0, 4).map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span className="text-xs text-gray-500">+{tags.length - 4} ще</span>
          )}
        </div>
      </div>

      <div className="mt-auto pt-4">
        <FavoriteButton location={location} />
      </div>
    </div>
  );
}

export default LocationCard;
