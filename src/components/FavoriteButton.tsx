import { addToFavorites, removeFromFavorites } from "../features/favorites/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import type { Location } from "../types/location";

function FavoriteButton({location}: {location: Location}) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(state => state.favorites.favorites);
  const isFavorite = favorites.find(favorite => favorite.id === location.id);
  
  const handleClick = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(location.id));
    } else {
      dispatch(addToFavorites(location))
    }
  }

  return (
    <button className="cursor-pointer bg-blue-800 text-white p-2 rounded" onClick={handleClick}>
      {isFavorite ? <span>Remove</span> : <span>Add to Favorite</span>}
    </button>
  )
}

export default FavoriteButton