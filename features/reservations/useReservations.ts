import { useQuery } from "react-query";
import axios from "axios";
import type { Reservation } from "./ReservationsModels";
import moment from "moment";
import { convertDatesInResponse } from "../../core/utils/convertDates";

type Filters = {
  dateFrom: string;
  dateTo: string;
  includeCancelled: string;
};

function useReservationsByGuest(guestId: string, filters: Filters, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`reservations/guests/${guestId}`, filters, ...dependencies],
    () =>
      axios.get(`/bookingService/api/reservations`, {
        params: {
          guestId,
          ...(filters.includeCancelled !== ""
            ? { includeCancelled: filters.includeCancelled === "1" }
            : {}),
          ...(filters.dateFrom ? { periodFrom: moment(filters.dateFrom).format() } : {}),
          ...(filters.dateTo ? { periodTo: moment(filters.dateTo).format() } : {}),
        },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!guestId,
    }
  );

  return {
    reservations: convertDatesInResponse(data?.data as Reservation[]),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

function useReservationsByAccommodation(
  accommodationId: string,
  filters: Filters,
  dependencies: any[] = []
) {
  const { data, isFetching, error } = useQuery(
    [`reservations/accommodations/${accommodationId}`, filters, ...dependencies],
    () =>
      axios.get(`/bookingService/api/reservations`, {
        params: {
          accommodationId,
          ...(filters.includeCancelled !== ""
            ? { includeCancelled: filters.includeCancelled === "1" }
            : {}),
          ...(filters.dateFrom ? { periodFrom: moment(filters.dateFrom).format() } : {}),
          ...(filters.dateTo ? { periodTo: moment(filters.dateTo).format() } : {}),
        },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!accommodationId,
    }
  );

  return {
    reservations: convertDatesInResponse(data?.data as Reservation[]),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { useReservationsByGuest, useReservationsByAccommodation };
