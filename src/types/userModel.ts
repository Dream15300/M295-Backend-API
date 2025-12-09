export type UserRole = 'employee' | 'manager';

export interface User {
  id: number;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string; // ISO-Datetime
}

export interface UserInput {
  username: string;
  passwordHash: string;
  role: UserRole;
}
