import { useQuery } from "react-query";
import axios from "axios";
import { type HostReviewsSummary } from "./HostReviewModels";

function useHostReviewsSummary(hostId: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`hosts/${hostId}/reviews/summary`, ...dependencies],
    () => axios.get(`/bookingService/api/hosts/${hostId}/reviews/summary`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!hostId,
    }
  );

  return {
    summary: data?.data as HostReviewsSummary,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { useHostReviewsSummary };
