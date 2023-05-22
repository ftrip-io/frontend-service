import { ComponentType, FC, useState } from "react";
import { useAccommodation } from "../useAccommodations";
import { usePhotos } from "../usePhotos";
import Image from "next/image";
import { Modal } from "../../../core/components/Modal";
import { Button } from "../../../core/components/Button";
import { ResultStatus, useResult } from "../../../core/contexts/Result";
import { Accommodation } from "../AccommodationModels";
import dynamic from "next/dynamic";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { extractErrorMessage } from "../../../core/utils/errors";

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
  const [updated, setUpdated] = useState<Accommodation>();
  const [urls, setUrls] = useState<string[]>();
  const { accommodation } = useAccommodation(id, [], updated);
  const { photoUrls } = usePhotos(id, [], urls);

  const [ActiveForm, setActiveForm] = useState<ComponentType<AccommodationUpdateFormProps>>();

  const setActiveModal = (name?: UpdateFormName) => {
    setActiveForm(name ? forms[name] : undefined);
  };

  const onSuccess = (accommodation: Accommodation, photoUrls?: string[]) => {
    notifications.success("You have successfully updated the accommodation.");
    setResult({ status: ResultStatus.Ok, type: "UPDATE_ACCOMMODATION" });
    setUpdated(accommodation);
    if (photoUrls) setUrls(photoUrls);
    setActiveModal(undefined);
  };

  const onError = (error: any) => {
    notifications.error(extractErrorMessage(error));
    setResult({ status: ResultStatus.Error, type: "UPDATE_ACCOMMODATION" });
    setActiveModal(undefined);
  };

  if (!accommodation) return <></>;

  return (
    <div className="p-5 mx-10">
      <h1 className="text-3xl font-semibold mb-3">{accommodation.title}</h1>
      <h3 className="">
        {accommodation.location.city}, {accommodation.location.region},{" "}
        {accommodation.location.country}
      </h3>
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
      <Button onClick={() => setActiveModal("property")}>Edit property</Button>
      <Button onClick={() => setActiveModal("rooms")}>Edit rooms</Button>
      <Button onClick={() => setActiveModal("title")}>Edit title</Button>
      <Button onClick={() => setActiveModal("houseRules")}>Edit houseRules</Button>
      <Button onClick={() => setActiveModal("amenities")}>Edit amenities</Button>
      <Button onClick={() => setActiveModal("location")}>Edit location</Button>
      <Button onClick={() => setActiveModal("pricing")}>Edit pricing</Button>
      <Button onClick={() => setActiveModal("photos")}>Edit photos</Button>
      <Button onClick={() => setActiveModal("availability")}>Edit availability</Button>
      <Button onClick={() => setActiveModal("calendar")}>Edit calendar</Button>
      <Button onClick={() => setUpdated(undefined)}>re</Button>
    </div>
  );
};
