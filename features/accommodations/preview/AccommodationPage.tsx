import { FC } from "react";
import { useAccommodation } from "../useAccommodations";
import { usePhotos } from "../usePhotos";
import Image from "next/image";

export const AccommodationPage: FC<{ id: string }> = ({ id }) => {
  const { photoUrls } = usePhotos(id);
  const { accommodation } = useAccommodation(id);

  if (!accommodation) return <></>;

  return (
    <div className="p-5 mx-10">
      <h1 className="text-3xl font-semibold mb-3">{accommodation.title}</h1>
      <h3 className="">
        {accommodation.location.city}, {accommodation.location.region},{" "}
        {accommodation.location.country}
      </h3>
      <div className="flex w-full h-96">
        <div className="w-full md:w-1/2 p-1">
          <Image
            src={photoUrls?.[0]}
            alt="image"
            width={1000}
            height={1000}
            className="h-full w-full object-cover rounded-lg md:rounded-r-none"
            priority={true}
          />
        </div>
        <div className="hidden md:block w-1/2">
          <div className="flex h-1/2">
            <div className="w-1/2 p-1">
              <Image
                src={photoUrls?.[1]}
                alt="image"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
                priority={true}
              />
            </div>
            <div className="w-1/2 p-1">
              <Image
                src={photoUrls?.[2]}
                alt="image"
                width={1000}
                height={1000}
                className="h-full w-full object-cover rounded-tr-lg"
                priority={true}
              />
            </div>
          </div>
          <div className="flex h-1/2">
            <div className="w-1/2 p-1">
              <Image
                src={photoUrls?.[3]}
                alt="image"
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
                priority={true}
              />
            </div>
            <div className="w-1/2 p-1">
              <Image
                src={photoUrls?.[4]}
                alt="image"
                width={1000}
                height={1000}
                className="h-full w-full object-cover rounded-br-lg"
                priority={true}
              />
            </div>
          </div>
        </div>
      </div>
      <div>What this place offers</div>
    </div>
  );
};
