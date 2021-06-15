export interface AuthResponse {
  user: {
    id?: number;
    email: string;
    roles: string[];
  };
  token: string;
}
