export type SelectOption = {
  value: number;
  label: string;
};

export type PaginatedAPIResponse<T> = {
  data: T[];
  page: number;
  pageSize: number;
  totalRecords?: number;
};
