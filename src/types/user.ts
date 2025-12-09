export interface User {
  id: number;
  email: string;
  username: string;
  password_hash: string;
  role: string; // 'employee' | 'manager' o.ä.
}

export interface UserPublic {
  id: number;
  email: string;
  username: string;
  role: string;
}
