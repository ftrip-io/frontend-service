import { useQuery } from "react-query";
import axios from "axios";
import { type PageResult } from "../../../types";
import { type AccomodationReview } from "./AccommodationReviewModels";

type Filers = {
  accommodationId?: string;
  guestId?: string;
  page: number;
  search: string;
};

function useAccomodationReviews(
  { accommodationId = "", guestId = "", page, search }: Filers,
  dependencies: any[] = []
) {
  const { data, isFetching, error } = useQuery(
    [`accommodations/reviews`, accommodationId, page, search, ...dependencies],
    () =>
      axios.get(`/bookingService/api/accommodations/reviews`, {
        params: {
          "filters.accomodationId": accommodationId || undefined,
          "filters.guestId": guestId || undefined,
          "filters.recentionText": search,
          "page.number": 1,
          "page.size": 3 * page,
        },
      }),
    {
      enabled:
        dependencies?.reduce((acc, dep) => acc && !dep, true) && (!!accommodationId || !!guestId),
    }
  );

  return {
    reviewsPage: data?.data as PageResult<AccomodationReview>,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { useAccomodationReviews };
