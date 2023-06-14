import { FC } from "react";
import { AccommodationSearchInfo } from "./SearchFilterModels";
import { Button } from "../../../core/components/Button";
import { usePhotos } from "../usePhotos";
import { useRouter } from "next/router";

export const AccommodationSearchResultCard: FC<{
  accommodationInfo: AccommodationSearchInfo;
}> = ({ accommodationInfo }) => {
  const { photoUrls } = usePhotos(accommodationInfo.accommodationId);

  const router = useRouter();

  const handleButtonClick = () => {
    router.push({
      pathname: `accommodations/${accommodationInfo.accommodationId}`,
      query: router.query,
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md flex mt-5">
        <img src={photoUrls?.[0]} className="w-1/3 h-60 object-cover rounded-lg" />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h2 className="text-2xl font-bold">{accommodationInfo.title}</h2>
            <h6 className="text-sm font-semibold mb-2">
              {accommodationInfo.location.city}, {accommodationInfo.location.region},{" "}
              {accommodationInfo.location.country}
            </h6>
            <p className="text-gray-700 mb-3">{accommodationInfo.description}</p>
            <p className="text-sm text-gray-700 flex items-center">
              🏚Number of bedrooms: {accommodationInfo.bedroomCount}
            </p>
            <p className="text-sm text-gray-700 flex items-center">
              🛏Number of beds: {accommodationInfo.bedCount}
            </p>
            <p className="text-sm text-gray-700 flex items-center">
              🛁Number of bathooms: {accommodationInfo.bathroomCount}{" "}
            </p>
          </div>
        </div>
        <div className="flex items-end justify-end p-4">
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
            <p className="text-lg font-semibold text-gray-800 mb-4">
              Total price: {accommodationInfo.totalPrice}$
            </p>

            <Button
              onClick={handleButtonClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
