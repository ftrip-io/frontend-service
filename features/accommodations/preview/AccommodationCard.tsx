import { type FC } from "react";
import { type Accommodation } from "../AccommodationModels";
import { usePhotos } from "../usePhotos";
import { ImageSlider } from "../../../core/components/ImageSlider";
import { useCurrentDistance } from "../useLocation";
import Link from "next/link";

export const AccommodationCard: FC<{ accommodation: Accommodation }> = ({ accommodation }) => {
  const { photoUrls } = usePhotos(accommodation.id);
  const { location } = accommodation;
  const { distance } = useCurrentDistance(location.latitude, location.longitude);
  return (
    <div className="m-5">
      <ImageSlider images={photoUrls} />
      <Link target="_blank" href={`accommodations/${accommodation.id}`}>
        <p className="font-bold">
          {location.city}, {location.country}
        </p>
        <p>{distance?.toFixed(0)} km away</p>
        <p>${accommodation.price} nigth</p>
      </Link>
    </div>
  );
};
