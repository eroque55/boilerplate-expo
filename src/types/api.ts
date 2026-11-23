export type TPaginationMeta = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type TPaginated<T> = {
  data: T[];
  meta: TPaginationMeta;
};

export type TFieldError = {
  pointer: string;
  detail: string;
};

export type TProblemDetails = {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  errors?: TFieldError[];
};
