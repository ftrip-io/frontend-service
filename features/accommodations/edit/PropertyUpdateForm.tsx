import { type FC, FormEvent, useState } from "react";
import { type Accommodation } from "../AccommodationModels";
import {
  type UpdateAccommodation,
  fromAccommodation,
  updateAccommodation,
} from "../accommodationActions";
import { Button } from "../../../core/components/Button";
import { useAction } from "../../../core/hooks/useAction";
import { PropertyForm } from "../creation/PropertyForm";
import { type AccommodationUpdateFormProps } from "./AccommodationEditPage";
import { usePropertyTypes } from "../usePropertyTypes";

const PropertyUpdateForm: FC<AccommodationUpdateFormProps> = ({
  accommodation,
  onCancel,
  onSuccess,
  onError,
}) => {
  const [update, setUpdate] = useState<UpdateAccommodation>(fromAccommodation(accommodation));
  const { propertyTypes } = usePropertyTypes();

  const updateAccommodationAction = useAction<UpdateAccommodation, Accommodation>(
    updateAccommodation(accommodation.id),
    { onSuccess, onError }
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateAccommodationAction(update);
  }

  return (
    <form onSubmit={onSubmit}>
      <PropertyForm
        allPropertyTypes={propertyTypes}
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

export default PropertyUpdateForm;
