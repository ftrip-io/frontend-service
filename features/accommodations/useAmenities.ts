import { useQuery } from "react-query";
import { type Amenity } from "./AccommodationModels";
import axios from "axios";

export function useAmenities(dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    ["am", ...dependencies],
    () => axios.get(`/catalogService/api/amenities`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true),
    }
  );

  return {
    amenities: data?.data as Amenity[],
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
