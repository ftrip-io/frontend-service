import axios from "axios";
import { useEffect, useState } from "react";
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

export const useGeolocation = () => {
  const [position, setPosition] = useState<LocationData>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude: lat, longitude: lon, accuracy } }) => setPosition({ lat, lon }),
      (e) => setError(e.message),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000000,
      }
    );
  }, []);

  return { position, error };
};

export const useCurrentDistance = (lat: number, lon: number) => {
  const { position, error } = useGeolocation();
  const [distance, setDistance] = useState<number>();

  useEffect(() => {
    if (position) setDistance(getDistance(position, { lat, lon }));
  }, [position, lat, lon]);

  return { distance, error };
};

function getDistance(origin: LocationData, destination: LocationData) {
  const lon1 = toRadian(origin.lon),
    lat1 = toRadian(origin.lat),
    lon2 = toRadian(destination.lon),
    lat2 = toRadian(destination.lat);
  const a =
    Math.pow(Math.sin((lat2 - lat1) / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon2 - lon1) / 2), 2);
  const c = 2 * Math.asin(Math.sqrt(a));
  const EARTH_RADIUS = 6371;
  return c * EARTH_RADIUS;
}
function toRadian(degree: number) {
  return (degree * Math.PI) / 180;
}
