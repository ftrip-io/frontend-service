import { type FC, FormEvent, useState } from "react";
import { type Accommodation } from "../AccommodationModels";
import {
  type UpdateAccommodationAmenities,
  updateAccommodationAmenities,
} from "../accommodationActions";
import { Button } from "../../../core/components/Button";
import { useAction } from "../../../core/hooks/useAction";
import { AmenitiesForm } from "../creation/AmenitiesForm";
import { type AccommodationUpdateFormProps } from "./AccommodationEditPage";
import { useAmenities } from "../useAmenities";

const AmenitiesUpdateForm: FC<AccommodationUpdateFormProps> = ({
  accommodation,
  onCancel,
  onSuccess,
  onError,
}) => {
  const [update, setUpdate] = useState<UpdateAccommodationAmenities>({
    amenities: [...accommodation.amenities],
  });
  const { groupedAmenities } = useAmenities();

  const updateAccommodationAction = useAction<UpdateAccommodationAmenities, Accommodation>(
    updateAccommodationAmenities(accommodation.id),
    { onSuccess, onError }
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateAccommodationAction(update);
  }

  return (
    <form onSubmit={onSubmit}>
      <AmenitiesForm
        allAmenities={groupedAmenities}
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

export default AmenitiesUpdateForm;
