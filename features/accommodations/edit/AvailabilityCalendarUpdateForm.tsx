import { type FC, FormEvent, useState } from "react";
import { type Accommodation } from "../AccommodationModels";
import {
  type UpdateAccommodationAvailabilities,
  updateAccommodationAvailabilities,
} from "../accommodationActions";
import { Button } from "../../../core/components/Button";
import { useAction } from "../../../core/hooks/useAction";
import { CalendarForm } from "../creation/CalendarForm";
import { type AccommodationUpdateFormProps } from "./AccommodationEditPage";

const AvailabilityCalendarUpdateForm: FC<AccommodationUpdateFormProps> = ({
  accommodation,
  onCancel,
  onSuccess,
  onError,
}) => {
  const [update, setUpdate] = useState<UpdateAccommodationAvailabilities>({
    availabilities: [...accommodation.availabilities],
    bookingAdvancePeriod: accommodation.bookingAdvancePeriod,
  });

  const updateAccommodationAction = useAction<UpdateAccommodationAvailabilities, Accommodation>(
    updateAccommodationAvailabilities(accommodation.id),
    { onSuccess, onError }
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    updateAccommodationAction(update);
  }

  return (
    <form onSubmit={onSubmit}>
      <CalendarForm
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

export default AvailabilityCalendarUpdateForm;
