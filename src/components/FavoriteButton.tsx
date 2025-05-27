import { addToFavorites, removeFromFavorites, selectFavorites } from "../features/favorites/favoritesSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHook";
import type { Location } from "../types/location";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function FavoriteButton({location}: {location: Location}) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector(selectFavorites);
  const isFavorite = favorites.find(favorite => favorite.id === location.id);
  
  const handleClick = () => {
    if (isFavorite) {
      dispatch(removeFromFavorites(location.id));
    } else {
      dispatch(addToFavorites(location));
    }
  }

  return (
    <button className="cursor-pointer" onClick={handleClick}>
      {isFavorite ? <FaHeart color="red" size={25} /> : <FaRegHeart color="#444" size={25} />}
    </button>
  )
}

export default FavoriteButton