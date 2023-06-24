import { useQuery } from "react-query";
import axios from "axios";
import getConfig from "next/config";
import { useEffect, useState } from "react";
const { publicRuntimeConfig: config } = getConfig();

export function usePhotos(id: string, dependencies: any[] = [], updated?: string[]) {
  const { data, isFetching, error } = useQuery(
    [`photos-${id}`, ...dependencies],
    () => axios.get(`/photoService/api/images/${id}`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !updated,
    }
  );

  const [path, setPath] = useState("/photoService/");

  useEffect(() => {
    if (typeof window !== "undefined" && window?.location?.host === "localhost") {
      setPath(`${config.imageServicePath}/`);
    }
  }, []);

  return {
    photoUrls: (updated ?? (data?.data as string[]) ?? []).map((p) =>
      p.startsWith("http") ? p : `${path}${p}`
    ),
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
