import LocationCard from "../components/LocationCard";
import { useAppSelector } from "../hooks/reduxHook";

function FavoritesPage() {
  const favorites = useAppSelector((state) => state.favorites.favorites);

  return (
    <main>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Улюблені місця</h1>

        {favorites.length === 0 ? (
          <p className="text-gray-600">У вас ще немає улюблених місць.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {favorites.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default FavoritesPage