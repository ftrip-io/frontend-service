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
  const amenities: Amenity[] = data?.data;
  return {
    amenities,
    groupedAmenities: amenities?.reduce((map, a) => {
      if (map.has(a.type.name)) map.get(a.type.name)?.push(a);
      else map.set(a.type.name, [a]);
      return map;
    }, new Map<string, Amenity[]>()),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
