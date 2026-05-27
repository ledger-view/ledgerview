import { PageRequest } from '@model/page.model';

export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
  currency: string;
  date: string;
  categoryId: string;
  accountId: string;
  note?: string;
}

export interface TransactionRequest {
  title: string;
  amount: number;
  type: TransactionType;
  date: string;
  categoryId: string;
  accountId: string;
  note?: string;
}

export interface TransactionPageRequest extends PageRequest {
  sort?: 'date' | 'amount' | 'title';
  accountId?: string;
  categoryId?: string;
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
}
