import { type FC, FormEvent, useState } from "react";
import { useMultistepForm } from "../../../core/hooks/useMultistepForm";
import { AmenitiesForm } from "./AmenitiesForm";
import { PropertyForm } from "./PropertyForm";
import { RoomsForm } from "./RoomsForm";
import { LocationForm } from "./LocationForm";
import { TitleAndDescriptionForm } from "./TitleAndDescriptionForm";
import { type ImageOrder, PhotosForm } from "./PhotosForm";
import { AvailabilityForm } from "./AvailabilityForm";
import { PricingForm } from "./PricingForm";
import { HouseRulesForm } from "./HouseRulesForm";
import { FinishForm } from "./FinishForm";
import { CalendarForm } from "./CalendarForm";
import { usePropertyTypes } from "../usePropertyTypes";
import { useAmenities } from "../useAmenities";
import { Button } from "../../../core/components/Button";
import { type CreateAccommodation, createAccommodation, uploadFiles } from "../createAccommodation";
import dynamic from "next/dynamic";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { ResultStatus, useResult } from "../../../core/contexts/Result";
import { useAction } from "../../../core/hooks/useAction";
import { extractErrorMessage } from "../../../core/utils/errors";
import { useRouter } from "next/router";

export const AccomodationMultiStepForm: FC = () => {
  const [data, setData] = useState<CreateAccommodation>({
    title: "",
    description: "",
    placeType: 2,
    isDecicatedForGuests: true,
    minGuests: 1,
    maxGuests: 1,
    bedroomCount: 0,
    bedCount: 0,
    bathroomCount: 0,
    noticePeriod: 1,
    bookingAdvancePeriod: 6,
    checkInFrom: 10,
    checkInTo: 20,
    bookBeforeTime: 0,
    minNights: 2,
    maxNights: 7,
    price: 1,
    isPerGuest: true,
    hostId: "11111111-1111-1111-1111-111111111111",
    houseRules: "",
    propertyTypeId: "",
    location: {
      id: "",
      country: "",
      region: "",
      city: "",
      postalCode: "",
      address: "",
      apt: "",
      latitude: 0,
      longitude: 0,
    },
    amenities: [],
    availabilities: [],
    priceDiffs: [],
  });
  const [selectedFiles, setSelectedFiles] = useState<any>();
  const [imagePreviews, setImagePreviews] = useState<ImageOrder[]>([]);

  const { propertyTypes } = usePropertyTypes();
  const { groupedAmenities } = useAmenities();

  function updateFields(fields: Partial<CreateAccommodation>) {
    setData((prev: any) => ({ ...prev, ...fields }));
  }
  const MapWithNoSSR = dynamic(() => import("./MapForm"), { ssr: false });
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, back, next } = useMultistepForm([
    <PropertyForm
      key="Property"
      allPropertyTypes={propertyTypes}
      updateFields={updateFields}
      {...data}
    />,
    <RoomsForm key="Rooms" updateFields={updateFields} {...data} />,
    <LocationForm key="Location 1/2" updateFields={updateFields} {...data} />,
    <MapWithNoSSR key="Location 2/2" updateFields={updateFields} {...data} />,
    <AmenitiesForm
      key="Amenities"
      allAmenities={groupedAmenities}
      updateFields={updateFields}
      {...data}
    />,
    <TitleAndDescriptionForm key="Title and description" updateFields={updateFields} {...data} />,
    <PhotosForm
      key="Photos"
      imagePreviews={imagePreviews}
      updateFiles={setSelectedFiles}
      updateImagePreviews={setImagePreviews}
    />,
    <AvailabilityForm key="Availability 1/2" updateFields={updateFields} {...data} />,
    <CalendarForm key="Availability 2/2" updateFields={updateFields} {...data} />,
    <PricingForm key="Pricing" updateFields={updateFields} {...data} />,
    <HouseRulesForm key="House rules" updateFields={updateFields} {...data} />,
    <FinishForm key="Finish" />,
  ]);

  const notifications = useNotifications();
  const { setResult } = useResult("accommodations");
  const router = useRouter();

  const createAccommodationAction = useAction<CreateAccommodation>(createAccommodation, {
    onSuccess: ({ id }) => {
      notifications.success("You have successfully created a new accommodation.");
      setResult({ status: ResultStatus.Ok, type: "CREATE_ACCOMMODATION" });
      uploadFiles(
        selectedFiles,
        imagePreviews.map((io) => io.index),
        id
      )
        .then(() => notifications.success("You have successfully uploaded photos."))
        .catch(() => notifications.error("Error while uploading photos."));
      router.push("/");
    },
    onError: (error: any) => {
      notifications.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "CREATE_ACCOMMODATION" });
    },
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLastStep) return next();

    data.priceDiffs.forEach((pd) => (pd.id = pd.id?.includes(".") ? undefined : pd.id));
    createAccommodationAction(data);
  }

  return (
    <div className="w-1/2 h-full">
      <div className="fixed top-0 py-4 bg-white w-1/2">
        <div className="pb-2">{step.key}</div>
        <div className="w-full bg-gray-300 rounded-full h-1">
          <div
            className="bg-blue-800 h-1 rounded-full"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>
      <form onSubmit={onSubmit} className="">
        <div className="py-16">{step}</div>
        <div className="fixed bottom-0 py-3 bg-white w-1/2 grid grid-cols-3">
          {isFirstStep ? (
            <div></div>
          ) : (
            <Button type="button" onClick={back}>
              Back
            </Button>
          )}
          <div></div>
          <Button type="submit">{isLastStep ? "Finish" : "Next"}</Button>
        </div>
      </form>
    </div>
  );
};
