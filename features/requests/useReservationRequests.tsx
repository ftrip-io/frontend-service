import { useQuery } from "react-query";
import axios from "axios";
import type { ReservationRequest } from "./ReservationRequestsModels";
import moment from "moment";
import { convertDatesInResponse } from "../../core/utils/convertDates";

type Filters = {
  dateFrom: string;
  dateTo: string;
  status: string;
};

function useReservationRequestsByGuest(
  guestId: string,
  filters: Filters,
  dependencies: any[] = []
) {
  const { data, isFetching, error } = useQuery(
    [`reservation-requests/guests/${guestId}`, filters, ...dependencies],
    () =>
      axios.get(`/bookingService/api/reservation-requests`, {
        params: {
          guestId,
          ...(filters.status !== "" ? { status: filters.status } : {}),
          ...(filters.dateFrom ? { periodFrom: moment(filters.dateFrom).format() } : {}),
          ...(filters.dateTo ? { periodTo: moment(filters.dateTo).format() } : {}),
        },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!guestId,
    }
  );

  return {
    reservationRequests: convertDatesInResponse(data?.data as ReservationRequest[]),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

function useReservationRequestsByAccommodation(
  accommodationId: string,
  filters: Filters,
  dependencies: any[] = []
) {
  const { data, isFetching, error } = useQuery(
    [`reservation-requests/accommodations/${accommodationId}`, filters, ...dependencies],
    () =>
      axios.get(`/bookingService/api/reservation-requests`, {
        params: {
          accommodationId,
          ...(filters.status !== "" ? { status: filters.status } : {}),
          ...(filters.dateFrom ? { periodFrom: moment(filters.dateFrom).format() } : {}),
          ...(filters.dateTo ? { periodTo: moment(filters.dateTo).format() } : {}),
        },
      }),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!accommodationId,
    }
  );

  return {
    reservationRequests: convertDatesInResponse(data?.data as ReservationRequest[]),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { useReservationRequestsByGuest, useReservationRequestsByAccommodation };
