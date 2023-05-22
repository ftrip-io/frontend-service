import { useQuery } from "react-query";
import axios from "axios";

export function usePhotos(id: string, dependencies: any[] = [], updated?: string[]) {
  const { data, isFetching, error } = useQuery(
    [`photos-${id}`, ...dependencies],
    () => axios.get(`/photoService/api/images/${id}`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !updated,
    }
  );

  return {
    photoUrls: updated ?? (data?.data as string[]),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
