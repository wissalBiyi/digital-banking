export interface LoginResponse {
  "access-token": string;
}

export interface AppUser {
  username: string;
  roles: string[];
}
