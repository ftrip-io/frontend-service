import { useQuery } from "react-query";
import axios from "axios";
import getConfig from "next/config";
const { publicRuntimeConfig: config } = getConfig();

export function usePhotos(id: string, dependencies: any[] = [], updated?: string[]) {
  const { data, isFetching, error } = useQuery(
    [`photos-${id}`, ...dependencies],
    () => axios.get(`/photoService/api/images/${id}`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !updated,
    }
  );

  return {
    photoUrls:
      updated ??
      ((data?.data as string[]) ?? []).map((p) => `${config.imageServicePath}/photoService/${p}`),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
