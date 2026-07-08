export interface PaginationMetadata {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: {
    page: T[];
    metadata: PaginationMetadata;
  };
  errors?: string[];
}
