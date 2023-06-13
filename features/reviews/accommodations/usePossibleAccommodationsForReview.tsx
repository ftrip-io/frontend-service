import { useQuery } from "react-query";
import axios from "axios";

function usePossibleAccommodationsForReview(guestId: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`accommodations/reviews/possibilities`, guestId, ...dependencies],
    () =>
      axios.get(`/bookingService/api/accommodations/reviews/possibilities`, {
        params: { guestId },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!guestId,
    }
  );

  return {
    accommodations: data?.data as string[],
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { usePossibleAccommodationsForReview };
