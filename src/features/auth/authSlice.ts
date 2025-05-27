import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { User } from "../../types/user";
import type { RootState } from "../../app/store";

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
    }
  },
});

export const { setUser, setToken, logout } = authSlice.actions;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export default authSlice.reducer
