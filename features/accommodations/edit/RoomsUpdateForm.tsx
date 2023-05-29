import { type FC, FormEvent, useState } from "react";
import { type Accommodation } from "../AccommodationModels";
import {
  type UpdateAccommodation,
  fromAccommodation,
  updateAccommodation,
} from "../accommodationActions";
import { Button } from "../../../core/components/Button";
import { useAction } from "../../../core/hooks/useAction";
import { RoomsForm } from "../creation/RoomsForm";
import { type AccommodationUpdateFormProps } from "./AccommodationEditPage";

const RoomsUpdateForm: FC<AccommodationUpdateFormProps> = ({
  accommodation,
  onCancel,
  onSuccess,
  onError,
}) => {
  const [update, setUpdate] = useState<UpdateAccommodation>(fromAccommodation(accommodation));

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
      <RoomsForm
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

export default RoomsUpdateForm;
