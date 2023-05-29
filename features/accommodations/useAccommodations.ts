import { useQuery } from "react-query";
import axios from "axios";
import { type Accommodation } from "./AccommodationModels";
import moment from "moment";

export function useAccommodation(
  accommodationId: Accommodation["id"],
  dependencies: any[] = [],
  updated?: Accommodation
) {
  const { data, isFetching, error } = useQuery(
    [accommodationId, ...dependencies],
    () => axios.get(`/catalogService/api/accommodations/${accommodationId}`),
    {
      enabled:
        dependencies?.reduce((acc, dep) => acc && !dep, true) && !!accommodationId && !updated,
    }
  );

  return {
    accommodation: convertDates(updated ?? data?.data),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

function convertDates(accommodation: Accommodation) {
  if (!accommodation) return;
  for (const a of accommodation.availabilities) {
    if (typeof a.fromDate === "string") a.fromDate = moment(a.fromDate).startOf("day").toDate();
    if (typeof a.toDate === "string") a.toDate = moment(a.toDate).endOf("day").toDate();
  }
  accommodation.availabilities.sort((a1, a2) => a1.fromDate.getTime() - a2.fromDate.getTime());
  return accommodation;
}
