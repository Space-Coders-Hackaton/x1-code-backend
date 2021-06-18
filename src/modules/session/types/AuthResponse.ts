export interface AuthResponse {
  user: {
    id?: string;
    name: string;
    email: string;
    roles: string[];
  };
  token: string;
}
