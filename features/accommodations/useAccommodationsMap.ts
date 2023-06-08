import { useQuery } from "react-query";
import axios from "axios";
import { createEntitiesMap } from "../../core/utils/map";

export type AccommodationInfo = {
  id: string;
  title: string;
};

export function useAccommodationsMap(accommodationIds: string[], dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [accommodationIds, ...dependencies],
    () =>
      axios.get(
        `/catalogService/api/accommodations?${accommodationIds?.map((id) => "ids=" + id).join("&")}`
      ),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!accommodationIds?.length,
    }
  );

  return {
    accommodationsMap: createEntitiesMap((data?.data as AccommodationInfo[]) ?? []),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
