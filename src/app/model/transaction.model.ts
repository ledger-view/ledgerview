import { PageRequest } from './page.model';

export interface Transaction {
  id: string;
  iban: string;
  date: string;
  currency: string;
  category: string;
  amount: number;
}

export interface TransactionPageRequest extends PageRequest {
  iban?: string;
  category?: string;
}
