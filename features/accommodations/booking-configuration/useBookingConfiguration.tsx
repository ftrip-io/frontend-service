import axios from "axios";
import { useQuery } from "react-query";
import { type AccommodationBookingConfiguration } from "./BookingConfigurationModels";

export function useBookingConfiguration(accommodationId: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`accommodations/${accommodationId}/booking-configuration`, ...dependencies],
    () => axios.get(`/bookingService/api/accommodations/${accommodationId}`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!accommodationId,
    }
  );

  return {
    bookingConfiguration: data?.data as AccommodationBookingConfiguration,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
