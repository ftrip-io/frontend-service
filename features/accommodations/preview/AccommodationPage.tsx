import { type FC, useState } from "react";
import { useAccommodation } from "../useAccommodations";
import { usePhotos } from "../usePhotos";
import Image from "next/image";
import { Modal } from "../../../core/components/Modal";
import dynamic from "next/dynamic";
import { CalendarPreview } from "./CalendarPreview";
import { BookingCard } from "./BookingCard";
import { useRouter } from "next/router";
import moment from "moment";
import { useUser } from "../../users/useUsers";
import { UserSpecific } from "../../../core/components/UserSpecific";
import { Button } from "../../../core/components/Button";
import { AccommodationReviewsSummary } from "../../reviews/accommodations/AccommodationReviewsSummary";
import { AccommodationReviews } from "../../reviews/accommodations/AccommodationReviews";
import Link from "next/link";
import { useReservationsByAccommodation } from "../../reservations/useReservations";

const MapPreview = dynamic(() => import("./MapPreview"), { ssr: false });

const CoverImage: FC<{ url: string; className?: string }> = ({ url, className = "" }) =>
  url ? (
    <Image
      src={url}
      alt="image"
      width={1000}
      height={1000}
      className={`h-full w-full object-cover ${className}`}
      priority={true}
    />
  ) : (
    <div className={`h-full w-full object-cover bg-gray-100 ${className}`} />
  );

export const AccommodationPage: FC<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const { photoUrls } = usePhotos(id);
  const { accommodation } = useAccommodation(id);
  const [openAmenities, setOpenAmenities] = useState(false);
  const [openPhotos, setOpenPhotos] = useState(false);

  const { user } = useUser(accommodation?.hostId ?? "");
  const fromDate = router.query?.fromDate?.toString();
  const toDate = router.query?.toDate?.toString();
  const [period, setPeriod] = useState<{ checkIn?: Date; checkOut?: Date }>({
    checkIn: fromDate ? moment(fromDate).startOf("day").toDate() : undefined,
    checkOut: toDate ? moment(toDate).endOf("day").toDate() : undefined,
  });

  const { reservations } = useReservationsByAccommodation(id, {
    dateFrom: moment().format("YYYY-MM-DD"),
    dateTo: "",
    includeCancelled: "0",
  });

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
          <CoverImage url={photoUrls?.[0]} className="rounded-lg md:rounded-r-none" />
        </div>
        <div className="hidden md:block w-1/2">
          <div className="flex h-1/2">
            <div className="w-1/2 p-1">
              <CoverImage url={photoUrls?.[1]} />
            </div>
            <div className="w-1/2 p-1">
              <CoverImage url={photoUrls?.[2]} className="rounded-tr-lg" />
            </div>
          </div>
          <div className="flex h-1/2">
            <div className="w-1/2 p-1">
              <CoverImage url={photoUrls?.[3]} />
            </div>
            <div className="w-1/2 p-1">
              <CoverImage url={photoUrls?.[4]} className="rounded-br-lg" />
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={openPhotos}
        onClose={() => setOpenPhotos(false)}
        title={`Photos (${photoUrls?.length})`}
      >
        {photoUrls?.map((url, i) => (
          <CoverImage url={url} key={i} className="m-2" />
        ))}
      </Modal>

      <div className="md:flex">
        <div className="md:w-2/3">
          <div className="border-b-2 py-4">
            <div className="flex min-w-full">
              <div className="flex-grow">
                <h1 className="text-xl font-semibold mt-3">
                  <div className="items-center min-w-full">
                    <Link href={`/users/${accommodation?.hostId}`} className="flex-grow cursor">
                      {["Entire place", "Private room", "Shared room"][accommodation.placeType]}{" "}
                      hosted by {user?.firstName} {user?.lastName}
                    </Link>{" "}
                    <AccommodationReviewsSummary accommodationId={accommodation.id} />
                  </div>
                </h1>
              </div>
              <UserSpecific userId={accommodation.hostId}>
                <Link href={`/accommodations/${accommodation.id}/edit`}>
                  <Button>Edit</Button>
                </Link>
              </UserSpecific>
            </div>
            <p>
              {accommodation.maxGuests} guests · {accommodation.bedroomCount} bedrooms ·{" "}
              {accommodation.bedCount} beds · {accommodation.bathroomCount} bath
            </p>
          </div>
          <div className="border-b-2 py-4">
            <pre className="whitespace-pre-wrap">{accommodation.description}</pre>
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
              reservations={reservations}
              bookingAdvancePeriod={accommodation.bookingAdvancePeriod}
              minDays={accommodation.minNights}
              maxDays={accommodation.maxNights}
              value={period}
              onChange={(c) => setPeriod({ ...c })}
            />
          </div>
        </div>
        <div className="md:w-1/3">
          <BookingCard {...period} {...accommodation} />
        </div>
      </div>
      <div className="border-b-2 py-4">
        <h1 className="text-xl font-semibold my-3">Where you will be</h1>
        <MapPreview location={accommodation.location} />
      </div>
      <div className="border-b-2 py-4">
        <h1 className="text-xl font-semibold my-3">Things to know</h1>
        <div>
          <pre className="whitespace-pre-wrap">{accommodation.houseRules}</pre>
        </div>
      </div>
      <div className="border-b-2 py-4">
        <h1 className="text-xl font-semibold my-3">Reviews</h1>
        <AccommodationReviews accommodationId={accommodation.id} />
      </div>
    </div>
  );
};
