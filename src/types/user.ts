export interface User {
  id?: number,
  username: string,
  token?: string
};

export interface AuthCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}