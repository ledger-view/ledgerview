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
  transactionCount: number;
}

export interface CategoryRequest {
  name: string;
  color: string;
  type: CategoryType;
}

const categoryTypeConfig: Record<CategoryType, { cssPillClass: string; translationKey: string }> = {
  [CategoryType.INCOME]: { cssPillClass: 'lv-pill-income', translationKey: 'theme.income' },
  [CategoryType.EXPENSE]: { cssPillClass: 'lv-pill-expense', translationKey: 'theme.expense' },
  [CategoryType.TRANSFER]: { cssPillClass: 'lv-pill-neutral', translationKey: 'theme.transfer' }
};
export const getCategoryCssPillClass = (type: CategoryType) => categoryTypeConfig[type].cssPillClass;
export const getCategoryTranslationKey = (type: CategoryType) => categoryTypeConfig[type].translationKey;
