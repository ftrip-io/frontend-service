import { type FC, useState } from "react";
import { useAccommodation } from "../useAccommodations";
import { usePhotos } from "../usePhotos";
import Image from "next/image";
import { Modal } from "../../../core/components/Modal";
import dynamic from "next/dynamic";
import { CalendarPreview } from "./CalendarPreview";

const MapPreview = dynamic(() => import("./MapPreview"), { ssr: false });

export const AccommodationPage: FC<{ id: string }> = ({ id }) => {
  const { photoUrls } = usePhotos(id);
  const { accommodation } = useAccommodation(id);
  const [openAmenities, setOpenAmenities] = useState(false);
  const [openPhotos, setOpenPhotos] = useState(false);

  const CoverImage: FC<{ index: number; className?: string }> = ({ index, className = "" }) => (
    <Image
      src={photoUrls?.[index]}
      alt="image"
      width={1000}
      height={1000}
      className={`h-full w-full object-cover ${className}`}
      priority={true}
    />
  );

  if (!accommodation) return <></>;

  return (
    <div className="p-5 mx-10">
      <h1 className="text-3xl font-semibold my-3">{accommodation.title}</h1>
      <h3 className="my-3">
        {accommodation.location.city}, {accommodation.location.region},{" "}
        {accommodation.location.country}
      </h3>
      <div className="flex w-full h-96" onClick={() => setOpenPhotos(true)}>
        <div className="w-full md:w-1/2 p-1">
          <CoverImage index={0} className="rounded-lg md:rounded-r-none" />
        </div>
        <div className="hidden md:block w-1/2">
          <div className="flex h-1/2">
            <div className="w-1/2 p-1">
              <CoverImage index={1} />
            </div>
            <div className="w-1/2 p-1">
              <CoverImage index={2} className="rounded-tr-lg" />
            </div>
          </div>
          <div className="flex h-1/2">
            <div className="w-1/2 p-1">
              <CoverImage index={3} />
            </div>
            <div className="w-1/2 p-1">
              <CoverImage index={4} className="rounded-br-lg" />
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openPhotos}
        onClose={() => setOpenPhotos(false)}
        title={`Photos (${photoUrls.length})`}
      >
        {photoUrls.map((url, i) => (
          <CoverImage index={i} key={url} className="m-2" />
        ))}
      </Modal>

      <div className="flex">
        <div className="w-2/3">
          <div className="border-b-2 py-4">
            <h1 className="text-xl font-semibold mt-3">
              {["Entire place", "Private room", "Shared room"][accommodation.placeType]} hosted by{" "}
              {accommodation.hostId}
            </h1>

            <p>
              {accommodation.maxGuests} guests · {accommodation.bedroomCount} bedrooms ·{" "}
              {accommodation.bedCount} beds · {accommodation.bathroomCount} bath
            </p>
          </div>
          <div className="border-b-2 py-4">
            <pre>{accommodation.description}</pre>
          </div>
          <div className="border-b-2 py-4">
            <h1 className="text-xl font-semibold my-3">What this place offers</h1>
            {accommodation.amenities.slice(0, 6).map((a) => (
              <div key={a.id}>{a.amenity.name}</div>
            ))}
            <Modal
              isOpen={openAmenities}
              onClose={() => setOpenAmenities(false)}
              title="What this place offers"
            >
              {accommodation.amenities.map((a) => (
                <div className="p-2 border-b-2" key={a.id}>
                  {a.amenity.name}
                </div>
              ))}
            </Modal>
            <button onClick={() => setOpenAmenities(true)} className="p-3 mt-3 border rounded-xl">
              Show all {accommodation.amenities.length} amenities
            </button>
          </div>
          <div className="border-b-2 py-4">
            <h1 className="text-xl font-semibold my-3">Calendar</h1>
            <CalendarPreview
              availabilities={accommodation.availabilities}
              bookingAdvancePeriod={accommodation.bookingAdvancePeriod}
            />
          </div>
        </div>
        <div className="w-1/3">
          <div className="m-10 p-5 border-2 rounded-2xl">
            <h2 className="text-xl">$ {accommodation.price} night</h2>
          </div>
        </div>
      </div>
      <div className="border-b-2 py-4">
        <h1 className="text-xl font-semibold my-3">Where you will be</h1>
        <MapPreview location={accommodation.location} />
      </div>
      <div className="border-b-2 py-4">
        <h1 className="text-xl font-semibold my-3">Things to know</h1>
        <div>
          <pre>{accommodation.houseRules}</pre>
        </div>
      </div>
      <div className="border-b-2 py-4">
        <h1 className="text-xl font-semibold my-3">Reviews</h1>
      </div>
    </div>
  );
};
