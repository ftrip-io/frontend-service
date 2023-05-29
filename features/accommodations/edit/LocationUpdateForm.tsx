import { type FC, FormEvent, useState } from "react";
import { Location, type Accommodation } from "../AccommodationModels";
import {
  type UpdateAccommodationLocation,
  updateAccommodationLocation,
} from "../accommodationActions";
import { Button } from "../../../core/components/Button";
import { useAction } from "../../../core/hooks/useAction";
import { LocationForm } from "../creation/LocationForm";
import { type AccommodationUpdateFormProps } from "./AccommodationEditPage";
import dynamic from "next/dynamic";

const MapForm = dynamic(() => import("../creation/MapForm"), { ssr: false });

const LocationUpdateForm: FC<AccommodationUpdateFormProps> = ({
  accommodation,
  onCancel,
  onSuccess,
  onError,
}) => {
  const [update, setUpdate] = useState<UpdateAccommodationLocation>({
    location: { ...accommodation.location },
  });
  const [location, setLocation] = useState<Location>({ ...accommodation.location, saved: false });

  const updateAccommodationAction = useAction<UpdateAccommodationLocation, Accommodation>(
    updateAccommodationLocation(accommodation.id),
    { onSuccess, onError }
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateAccommodationAction(update);
  }

  return (
    <form onSubmit={onSubmit}>
      <LocationForm
        location={location}
        updateFields={(fields) => setLocation((prev) => ({ ...prev, ...fields.location }))}
      />
      <Button type="button" onClick={() => setUpdate({ location })} className="my-3 float-right">
        Find
      </Button>
      <MapForm
        {...update}
        updateFields={(fields) => setUpdate((prev) => ({ ...prev, ...fields }))}
      />
      <div className="flex flex-wrap justify-between mt-10">
        <Button type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button>Save changes</Button>
      </div>
    </form>
  );
};

export default LocationUpdateForm;
