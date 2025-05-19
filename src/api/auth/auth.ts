import type { AuthCredentials, LoginResponse, User } from "../../types/user";
import instance from "../instance"

export const register = async (cridentials: AuthCredentials): Promise<User> => {
  const response = await instance.post<User>("/auth/register", cridentials, {
    headers: {
      'Content-Type': 'application/json'
    }
  });

  return response.data;
};

export const login = async (credentials: AuthCredentials): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>("/auth/login", credentials, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return response.data;
};
