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
  type: CategoryType;
}

const categoryTypeToCssPillClass: Record<CategoryType, string> = {
  [CategoryType.INCOME]: 'lv-pill-income',
  [CategoryType.EXPENSE]: 'lv-pill-expense',
  [CategoryType.TRANSFER]: 'lv-pill-neutral'
};

export const getCategoryCssPillClass = (type: CategoryType) => categoryTypeToCssPillClass[type];
