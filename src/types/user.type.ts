// src/types/user.type.ts
export interface User {
  id: number;
  nama: string;                         // Full name of the user (string)
  email: string;                        // User email (string)
  password: string;                     // User password (hashed string)
  peran: 'manajer' | 'Bendahara' | 'Pemasaran' | 'Pimpinan';  // User role (enum)
}

