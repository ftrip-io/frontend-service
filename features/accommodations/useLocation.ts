import axios from "axios";
import { useQuery } from "react-query";

type LocationData = {
  lat: number;
  lon: number;
};

export function useLocation(
  query: string,
  cb: (data?: LocationData) => void,
  dependencies: any[] = []
) {
  const enabled = dependencies?.reduce((acc, dep) => acc && !dep, true);
  const { data, isFetching, error } = useQuery(
    [query, ...dependencies],
    () =>
      axios.get("https://nominatim.openstreetmap.org/search.php", {
        params: { format: "json", addressdetails: 1, limit: 1, q: query },
      }),
    {
      enabled,
      onSuccess(data) {
        cb(
          data?.data[0] && {
            lat: parseFloat(data.data[0].lat),
            lon: parseFloat(data.data[0].lon),
          }
        );
      },
    }
  );

  return {
    locationData: data?.data[0]
      ? {
          lat: parseFloat(data.data[0].lat),
          lon: parseFloat(data.data[0].lon),
        }
      : undefined,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
    notFound: enabled && !isFetching && !data?.data[0],
  };
}
