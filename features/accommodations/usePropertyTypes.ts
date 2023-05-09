import { useQuery } from "react-query";
import { type PropertyType } from "./AccommodationModels";
import axios from "axios";

export function usePropertyTypes(dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    ["pt", ...dependencies],
    () => axios.get(`/catalogService/api/propertyTypes`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true),
    }
  );

  return {
    propertyTypes: data?.data as PropertyType[],
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
