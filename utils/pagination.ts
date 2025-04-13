import { PaginatedListResponse } from '@/models';

export function transformPaginatedList<T, TOut = T>(
  data: PaginatedListResponse<T>,
  transform: (item: T) => TOut = item => item as unknown as TOut
): {
  items: TOut[];
  meta: {
    nextPage: number | undefined;
    total: number;
  };
} {
  return {
    items: data.items.map(transform),
    meta: {
      total: data.meta.total,
      nextPage:
        data.meta.current_page < data.meta.total_pages ? data.meta.current_page + 1 : undefined,
    },
  };
}
