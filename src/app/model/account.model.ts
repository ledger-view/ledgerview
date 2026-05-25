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

export interface AccountRequest {
  name: string;
  institution: string;
  type: AccountType;
  currency: string;
  balance: number;
  number?: string;
}
