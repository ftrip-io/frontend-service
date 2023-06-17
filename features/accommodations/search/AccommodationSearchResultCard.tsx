import { type FC } from "react";
import { type AccommodationSearchInfo } from "./SearchFilterModels";
import { Button } from "../../../core/components/Button";
import { usePhotos } from "../usePhotos";
import { useRouter } from "next/router";
import { Authorized } from "../../../core/components/Authorized";
import { AuthUserType } from "../../../core/contexts/Auth";
import Link from "next/link";
import { ImageSlider } from "../../../core/components/ImageSlider";
import { useCurrentDistance } from "../useLocation";
import { truncate } from "../../../core/utils/string";

export const AccommodationSearchResultCard: FC<{
  accommodationInfo: AccommodationSearchInfo;
}> = ({ accommodationInfo }) => {
  const { photoUrls } = usePhotos(accommodationInfo.accommodationId);
  const { distance } = useCurrentDistance(
    accommodationInfo.location.latitude,
    accommodationInfo.location.longitude
  );
  const router = useRouter();

  const handleButtonClick = () => {
    router.push({
      pathname: `accommodations/${accommodationInfo.accommodationId}`,
      query: router.query,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md xl:flex m-2">
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
          </h6>
          <h6 className="text-sm font-semibold mb-2">{distance?.toFixed(0)} km away</h6>
          <h6 className="text-sm font-semibold text-gray-400 mb-2 overflow-hidden">
            {truncate(accommodationInfo.description, 200)}
          </h6>
          <p className="text-sm text-gray-700 flex items-center mb-3">
            <span className="flex"> · 🏚 {accommodationInfo.bedroomCount} bedrooms</span>
            <span className="flex"> · 🛏 {accommodationInfo.bedCount} beds</span>
            <span className="flex"> · 🛁 {accommodationInfo.bathroomCount} bathooms</span>
          </p>
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
            {accommodationInfo.totalPrice ? (
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Total price: {accommodationInfo.totalPrice}$
              </p>
            ) : (
              <></>
            )}
            <div className="flex justify-end">
              {accommodationInfo.totalPrice ? (
                <Authorized roles={[AuthUserType.Guest]}>
                  <Button
                    onClick={handleButtonClick}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Book Now
                  </Button>
                </Authorized>
              ) : (
                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <Link href={`/accommodations/${accommodationInfo.accommodationId}`}>
                    Check Out
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
