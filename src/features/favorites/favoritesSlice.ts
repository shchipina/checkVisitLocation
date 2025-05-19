import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Location } from "../../types/location";
import type { RootState } from "../../store/store";

interface FavoritesState {
  favorites: Location[]
}

const initialState: FavoritesState = {
  favorites: [],
}

const favoriteSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Location>) => {
      const isFavorite = state.favorites.findIndex(favorite => favorite.id === action.payload.id);

      if (isFavorite === -1) {
        state.favorites.push(action.payload);
      }
    },
    removeFromFavorites: (state, action: PayloadAction<number>) => {
      state.favorites = state.favorites.filter(favorite => favorite.id !== action.payload)
    },
  }
});

export const { addToFavorites, removeFromFavorites } = favoriteSlice.actions;
export const auth = (state: RootState) => state.auth
export default favoriteSlice.reducer;