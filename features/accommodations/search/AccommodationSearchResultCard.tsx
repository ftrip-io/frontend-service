import { type FC } from "react";
import { type AccommodationSearchInfo } from "./SearchFilterModels";
import { Button } from "../../../core/components/Button";
import { usePhotos } from "../usePhotos";
import { useRouter } from "next/router";
import { AuthUserType } from "../../../core/contexts/Auth";
import Link from "next/link";
import { ImageSlider } from "../../../core/components/ImageSlider";
import { useCurrentDistance } from "../useLocation";
import { truncate } from "../../../core/utils/string";
import { useIsAuthorized } from "../../../core/hooks/useIsAuthorized";

export const AccommodationSearchResultCard: FC<{
  accommodationInfo: AccommodationSearchInfo;
}> = ({ accommodationInfo }) => {
  const { photoUrls } = usePhotos(accommodationInfo.accommodationId);
  const { distance } = useCurrentDistance(
    accommodationInfo.location.latitude,
    accommodationInfo.location.longitude
  );
  const router = useRouter();

  const isAuthorized = useIsAuthorized();
  const isGuest = isAuthorized({ roles: [AuthUserType.Guest] });

  const handleButtonClick = () => {
    router.push({
      pathname: `accommodations/${accommodationInfo.accommodationId}`,
      query: router.query,
    });
  };

  const canBeBooked =
    accommodationInfo.totalPrice !== undefined && accommodationInfo.totalPrice !== null;

  return (
    <div className="bg-white rounded-lg shadow-md flex mt-5">
      <div className="flex justify-center">
        <ImageSlider images={photoUrls} />
      </div>

      <div className="w-full p-4 flex flex-col">
        <div className="justify-between flex-grow">
          <h2 className="text-2xl font-bold">
            <Link href={`/accommodations/${accommodationInfo.accommodationId}`}>
              {accommodationInfo.title}
            </Link>
          </h2>
          <h6 className="text-sm font-semibold">
            {accommodationInfo.location.city}, {accommodationInfo.location.region},{" "}
            {accommodationInfo.location.country}
            {distance ? ` (${distance?.toFixed(0)} km away)` : ``}
          </h6>

          <h6 className="text-sm font-semibold text-gray-400 mb-2 break-all">
            {truncate(accommodationInfo.description, 200)}
          </h6>

          <div className="text-sm text-gray-700 items-center">
            <p>🏚Number of bedrooms: {accommodationInfo.bedroomCount}</p>
            <p>🛏Number of beds: {accommodationInfo.bedCount}</p>
            <p>🛁Number of bathooms: {accommodationInfo.bathroomCount}</p>
          </div>
        </div>
        <div className="flex items-end justify-end">
          <div className="flex flex-col">
            {accommodationInfo.isPerGuest ? (
              <p className="text-lg font-semibold text-gray-800 ">
                Price per guest: {accommodationInfo.price}$
              </p>
            ) : (
              <p className="text-lg font-semibold text-gray-800 ">
                Price per unit: {accommodationInfo.price}$
              </p>
            )}

            {canBeBooked ? (
              <p className="text-lg font-semibold text-gray-800">
                Total price: {accommodationInfo.totalPrice}$
              </p>
            ) : (
              <></>
            )}

            {canBeBooked && isGuest ? (
              <Button
                onClick={handleButtonClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Book Now
              </Button>
            ) : (
              <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                <Link href={`/accommodations/${accommodationInfo.accommodationId}`}>Check Out</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
