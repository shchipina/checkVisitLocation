import axios from "axios";
import { store } from "../app/store";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL
});

instance.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
