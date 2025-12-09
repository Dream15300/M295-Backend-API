export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: string;
}

export interface UserPublic {
  id: number;
  email: string;
  role: string;
}
