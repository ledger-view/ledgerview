export interface PageRequest {
  page?: number;
  size?: number;
  sort?: string;
}

export interface Page<T> {
  content: T[];

  number: number;
  size: number;
  totalElements: number;
  totalPages: number;

  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;

  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
}
