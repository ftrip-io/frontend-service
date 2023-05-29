import { type ComponentType, type FC, useState } from "react";
import { useAccommodation } from "../useAccommodations";
import { usePhotos } from "../usePhotos";
import Image from "next/image";
import { Modal } from "../../../core/components/Modal";
import { ResultStatus, useResult } from "../../../core/contexts/Result";
import { type Accommodation } from "../AccommodationModels";
import dynamic from "next/dynamic";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { extractErrorMessage } from "../../../core/utils/errors";
import { deleteAccommodation, deleteFolder } from "../accommodationActions";
import { useRouter } from "next/router";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { bookingAdvancePeriodLabels } from "../creation/CalendarForm";
import { toText } from "../../../core/utils/cron";

export type AccommodationUpdateFormProps = {
  accommodation: Accommodation;
  onCancel: () => void;
  onSuccess: (accommodation: Accommodation, photoUrls?: string[]) => void;
  onError: (e: any) => void;
  photoUrls?: string[];
};

type UpdateFormName =
  | "rooms"
  | "property"
  | "title"
  | "houseRules"
  | "amenities"
  | "location"
  | "pricing"
  | "photos"
  | "availability"
  | "calendar";

const forms = {
  rooms: dynamic(() => import("./RoomsUpdateForm")),
  property: dynamic(() => import("./PropertyUpdateForm")),
  title: dynamic(() => import("./TitleAndDescriptionUpdateForm")),
  houseRules: dynamic(() => import("./HouseRulesUpdateForm")),
  amenities: dynamic(() => import("./AmenitiesUpdateForm")),
  location: dynamic(() => import("./LocationUpdateForm")),
  pricing: dynamic(() => import("./PricingUpdateForm")),
  photos: dynamic(() => import("./PhotosUpdateForm")),
  availability: dynamic(() => import("./AvailabilityUpdateForm")),
  calendar: dynamic(() => import("./AvailabilityCalendarUpdateForm")),
} as const;

export const AccommodationEditPage: FC<{ id: string }> = ({ id }) => {
  const { setResult, result } = useResult("accommodations");
  const notifications = useNotifications();
  const [updatedAccommodation, setUpdatedAccommodation] = useState<Accommodation>();
  const [updatedUrls, setUpdatedUrls] = useState<string[]>();
  const { accommodation } = useAccommodation(id, [], updatedAccommodation);
  const { photoUrls } = usePhotos(id, [], updatedUrls);
  const router = useRouter();

  const [ActiveForm, setActiveForm] = useState<ComponentType<AccommodationUpdateFormProps>>();

  const setActiveModal = (name?: UpdateFormName) => {
    setActiveForm(name ? forms[name] : undefined);
  };

  const onSuccess = (accommodation: Accommodation, photoUrls?: string[]) => {
    notifications.success("You have successfully updated the accommodation.");
    setResult({ status: ResultStatus.Ok, type: "UPDATE_ACCOMMODATION" });
    setUpdatedAccommodation(accommodation);
    if (photoUrls) setUpdatedUrls(photoUrls);
    setActiveModal(undefined);
  };

  const onError = (error: any) => {
    notifications.error(extractErrorMessage(error));
    setResult({ status: ResultStatus.Error, type: "UPDATE_ACCOMMODATION" });
    setActiveModal(undefined);
  };

  const deleteAccommodationAndPhotos = async () => {
    if (!accommodation) return;
    if (!confirm("Are you sure?")) return;
    try {
      await deleteFolder(accommodation.id);
      await deleteAccommodation(accommodation.id);
      router.push("/");
    } catch (e: any) {
      onError(e);
    }
  };

  const EditButton: FC<{ formName: UpdateFormName }> = ({ formName }) => (
    <button
      type="button"
      onClick={() => setActiveModal(formName)}
      className="m-2 p-2 bg-indigo-600 hover:bg-indigo-700 rounded-md"
    >
      <PencilSquareIcon className="w-5 h-5 text-white" />
    </button>
  );

  if (!accommodation) return <></>;

  return (
    <div className="p-5 mx-10">
      <Modal title="" isOpen={!!ActiveForm} onClose={() => setActiveModal(undefined)}>
        {ActiveForm && (
          <ActiveForm
            accommodation={accommodation}
            onCancel={() => setActiveModal(undefined)}
            onSuccess={onSuccess}
            onError={onError}
            photoUrls={photoUrls}
          />
        )}
      </Modal>
      <div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Title</h4>
            <p>{accommodation.title}</p>
            <h4 className="font-semibold">Description</h4>
            <pre>{accommodation.description}</pre>
          </div>
          <div>
            <EditButton formName="title" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Property type</h4>
            <p>{accommodation.propertyType.name}</p>
            <h4 className="font-semibold">Place type</h4>
            <p>{["Entire place", "Private room", "Shared room"][accommodation.placeType]}</p>
            <h4 className="font-semibold">Dedicated guest space</h4>
            <p>{accommodation.isDecicatedForGuests ? "Yes" : "No"}</p>
          </div>
          <div>
            <EditButton formName="property" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Min guests</h4>
            <p>{accommodation.minGuests}</p>
            <h4 className="font-semibold">Max guests</h4>
            <p>{accommodation.maxGuests}</p>
            <h4 className="font-semibold">Bedrooms</h4>
            <p>{accommodation.bedroomCount}</p>
            <h4 className="font-semibold">Beds</h4>
            <p>{accommodation.bedCount}</p>
            <h4 className="font-semibold">Bathrooms</h4>
            <p>{accommodation.bathroomCount}</p>
          </div>
          <div>
            <EditButton formName="rooms" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">House rules</h4>
            <pre>{accommodation.houseRules}</pre>
          </div>
          <div>
            <EditButton formName="houseRules" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Amenities</h4>
            <p>{accommodation.amenities.map((a) => a.amenity.name).join(", ")}</p>
          </div>
          <div>
            <EditButton formName="amenities" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Country</h4>
            <p>{accommodation.location.country}</p>
            <h4 className="font-semibold">State</h4>
            <p>{accommodation.location.region || "-"}</p>
            <h4 className="font-semibold">City</h4>
            <p>{accommodation.location.city}</p>
            <h4 className="font-semibold">Address</h4>
            <p>{accommodation.location.address}</p>
            <h4 className="font-semibold">ZIP code</h4>
            <p>{accommodation.location.postalCode || "-"}</p>
            <h4 className="font-semibold">Apt., Suite</h4>
            <p>{accommodation.location.apt || "-"}</p>
          </div>
          <div>
            <EditButton formName="location" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Photos</h4>
            <div className="flex overflow-x-scroll overflow-y-auto">
              {photoUrls.map((url) => (
                <Image
                  src={url}
                  alt="image"
                  width={1000}
                  height={1000}
                  className="h-20 w-auto mr-2 rounded-lg"
                  priority={true}
                  key={url}
                />
              ))}
            </div>
          </div>
          <div>
            <EditButton formName="photos" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Notice period</h4>
            <p>
              {accommodation.noticePeriod || "Same"} day{accommodation.noticePeriod > 1 && "s"}
            </p>
            <h4 className="font-semibold">Check-in window</h4>
            <p>
              {accommodation.checkInFrom}:00 - {accommodation.checkInTo}:00
            </p>
            <h4 className="font-semibold">Min nights</h4>
            <p>{accommodation.minNights}</p>
            <h4 className="font-semibold">Max nights</h4>
            <p>{accommodation.maxNights}</p>
          </div>
          <div>
            <EditButton formName="availability" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Calendar</h4>
            <h4 className="font-semibold">How far in advance can guests book</h4>
            <p>{bookingAdvancePeriodLabels[accommodation.bookingAdvancePeriod + ""]}</p>
          </div>
          <div>
            <EditButton formName="calendar" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Price</h4>
            <p>$ {accommodation.price.toFixed(2)}</p>
            <h4 className="font-semibold">Is this price per guest</h4>
            <p>{accommodation.isPerGuest ? "Yes" : "No"}</p>
            {accommodation.priceDiffs.length > 0 && (
              <>
                <h4 className="font-semibold">Price differences</h4>
                <ul className="list-disc">
                  {accommodation.priceDiffs.map((pd) => (
                    <li key={pd.id}>
                      {pd.percentage.toFixed(2)}% during {toText(pd.when)}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
          <div>
            <EditButton formName="pricing" />
          </div>
        </div>
        <div className="border-b-2 p-2 flex justify-between">
          <div>
            <h4 className="font-semibold">Delete accommodation</h4>
          </div>
          <div>
            <button
              type="button"
              onClick={deleteAccommodationAndPhotos}
              className="m-2 p-2 bg-red-600 hover:bg-red-700 rounded-md"
            >
              <TrashIcon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
