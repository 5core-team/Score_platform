export type Role = 'ADMIN' | 'COUNTRY_REPRESENTATIVE' | 'FRONT_OFFICE' | 'BAILIFF' | 'ADVISOR';

export type UserStatus = 'active' | 'blocked';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  status: UserStatus;
  zoneId?: string;
  countryId?: string;
  birthDate?: string;
  createdAt: string;
}

export interface Country {
  id: string;
  name: string;
  email: string;
  phone: string;
  iso: string;
  username: string;
  status: 'active' | 'inactive';
  representativeId?: string;
  createdAt: string;
}

export interface Zone {
  id: string;
  name: string;
  countryId: string;
  createdAt: string;
}

export interface Client {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  zoneId: string;
  countryId: string;
  createdBy: string;
  createdAt: string;
}

export type TransactionType = 'loan' | 'repayment';

export interface Transaction {
  id: string;
  clientId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  description: string;
  date: string;
  createdBy: string;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  countryId?: string;
  zoneId?: string;
}
