import { useInfiniteQuery } from "react-query";
import { useService } from "@/services";

const useFetchUserPlans = () => {
  const service = useService();
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["userPlans"],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await service.userPlans.listUserPlans();
      return response;
    },
    getNextPageParam: (lastPage, pages) => {
      if (lastPage?.current_page < lastPage?.total_pages) {
        return lastPage.current_page + 1;
      }
      return undefined;
    },
  });

  const onLoadMore = () => {
    if (!hasNextPage || isFetchingNextPage) return;
    fetchNextPage();
  };

  return {
    isLoading,
    data: data?.pages?.[0] || [],
    onLoadMore,
    refetch,
  };
};

export default useFetchUserPlans;
