/**
 * Pagination response interface
 */
export interface PaginationResponse<T> {
  /** Items array for the current page */
  items: T[];
  /** Total number of items across all pages */
  totalItems: number;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Optional metadata */
  meta?: Record<string, any>;
}

/**
 * Pagination parameters for requests
 */
export interface PaginationParams {
  /** Page number (1-based) */
  page?: number;
  /** Number of items per page */
  limit?: number;
  /** Sorting criteria */
  sort?: string[];
}
