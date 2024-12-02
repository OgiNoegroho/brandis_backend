// src/types/user.type.ts
export interface User {
  user_id: string;
  name?: string;
  email: string;
  password: string;
  role?: string | null;
}