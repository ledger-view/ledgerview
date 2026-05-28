export type AccountType = 'Checking' | 'Savings' | 'Cash' | 'Crypto';

export interface Account {
  id: string;
  name: string;
  institution: string;
  type: AccountType;
  currency: string;
  balance: number;
  number: string;
}

export interface AccountCreateRequest {
  name: string;
  institution: string;
  type: AccountType;
  currency: string;
  balance: number;
  number?: string;
}

export interface AccountUpdateRequest {
  name: string;
  institution: string;
  type: AccountType;
  number?: string;
}
