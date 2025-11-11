export type PaginationResponse<T> = {
  data: T[];
  count: number;
  total: number;
  page: number;
  pageCount: number;
};

export type PaginationInput = {
  page?: number;
  limit?: number;
};

export type BaseModel = {
  id: string | number;
  createdAt?: string;
  updatedAt?: string;
};
