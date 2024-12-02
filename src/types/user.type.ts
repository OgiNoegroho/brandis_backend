// src/types/user.type.ts
export interface User {
  id: number;                           // Auto-incrementing ID from SERIAL (number)
  nama: string;                         // Full name of the user (string)
  email: string;                        // User email (string)
  password: string;                     // User password (hashed string)
  peran: 'Admin Produksi' | 'Admin Gudang' | 'Bendahara' | 'Pemasaran' | 'Pimpinan';  // User role (enum)
}

