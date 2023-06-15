import axios from "axios";
import type { AccommodationSearchInfo, SearchFilters } from "./SearchFilterModels";
import { useQuery } from "react-query";
import moment from "moment";

export function useSearchAvailableAccommodations(filters: SearchFilters, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    ["accommodations/search", filters, ...dependencies],
    () =>
      axios.get(`/catalogService/api/Accommodations/search`, {
        params: {
          Location: filters.location,
          GuestNum: filters.guestNum,
          FromDate: !!filters.fromDate
            ? moment(filters.fromDate).startOf("day").format()
            : filters.fromDate,
          ToDate: !!filters.toDate ? moment(filters.toDate).endOf("day").format() : filters.toDate,
        },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!filters.location,
    }
  );

  return {
    accommodationSearchResults: (data?.data as AccommodationSearchInfo[]) ?? undefined,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
