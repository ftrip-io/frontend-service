import { useQuery } from "react-query";
import axios from "axios";

function usePossibleHostsForReview(guestId: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`hosts/reviews/possibilities`, guestId, ...dependencies],
    () =>
      axios.get(`/bookingService/api/hosts/reviews/possibilities`, {
        params: { guestId },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!guestId,
    }
  );

  return {
    hosts: data?.data as string[],
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { usePossibleHostsForReview };
