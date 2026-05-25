export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  TRANSFER = 'TRANSFER'
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: CategoryType;
}

export interface CategoryRequest {
  name: string;
  color: string;
  kind: CategoryType;
}
