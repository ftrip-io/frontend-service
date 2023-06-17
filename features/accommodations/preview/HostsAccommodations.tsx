import { type FC } from "react";
import { useAccommodationsByHost } from "../useAccommodations";
import { AccommodationSearchResultCard } from "../search/AccommodationSearchResultCard";

export const HostsAccommodations: FC<{ hostId: string }> = ({ hostId }) => {
  const { accommodations } = useAccommodationsByHost(hostId);
  return (
    <div>
      {accommodations?.map((accommodationInfo, i) => (
        <AccommodationSearchResultCard accommodationInfo={accommodationInfo} key={i} />
      ))}
    </div>
  );
};
