// src/types/user.type.ts
export interface User {
  id: number;
  nama: string;                         
  email: string;                        
  password: string;                    
  peran: 'manajer' | 'Bendahara' | 'Pemasaran' | 'Pimpinan'; 
}
