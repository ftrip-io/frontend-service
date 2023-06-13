import { useQuery } from "react-query";
import axios from "axios";
import { type PageResult } from "../../../types";
import { type HostReview } from "./HostReviewModels";

type Filers = {
  hostId?: string;
  guestId?: string;
  page: number;
  search: string;
};

function useHostReviews(
  { hostId = "", guestId = "", page, search }: Filers,
  dependencies: any[] = []
) {
  const { data, isFetching, error } = useQuery(
    [`hosts/reviews`, hostId, page, search, ...dependencies],
    () =>
      axios.get(`/bookingService/api/hosts/reviews`, {
        params: {
          "filters.hostId": hostId || undefined,
          "filters.guestId": guestId || undefined,
          "filters.recentionText": search,
          "page.number": 1,
          "page.size": 3 * page,
        },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && (!!hostId || !!guestId),
    }
  );

  return {
    reviewsPage: data?.data as PageResult<HostReview>,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { useHostReviews };
