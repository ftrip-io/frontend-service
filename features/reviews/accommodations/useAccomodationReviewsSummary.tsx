import { useQuery } from "react-query";
import axios from "axios";
import { type AccomodationReviewsSummary } from "./AccommodationReviewModels";

function useAccomodationReviewsSummary(accommodationId: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`accommodations/${accommodationId}/reviews/summary`, ...dependencies],
    () => axios.get(`/bookingService/api/accommodations/${accommodationId}/reviews/summary`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!accommodationId,
    }
  );

  return {
    summary: data?.data as AccomodationReviewsSummary,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { useAccomodationReviewsSummary };
