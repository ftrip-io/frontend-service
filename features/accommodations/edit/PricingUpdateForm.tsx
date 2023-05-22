import { type FC, FormEvent, useState } from "react";
import { type Accommodation } from "../AccommodationModels";
import {
  type UpdateAccommodationPricing,
  updateAccommodationPricing,
} from "../accommodationActions";
import { Button } from "../../../core/components/Button";
import { useAction } from "../../../core/hooks/useAction";
import { PricingForm } from "../creation/PricingForm";
import { type AccommodationUpdateFormProps } from "./AccommodationEditPage";

const PricingUpdateForm: FC<AccommodationUpdateFormProps> = ({
  accommodation,
  onCancel,
  onSuccess,
  onError,
}) => {
  const [update, setUpdate] = useState<UpdateAccommodationPricing>({
    price: accommodation.price,
    isPerGuest: accommodation.isPerGuest,
    priceDiffs: [...accommodation.priceDiffs],
  });

  const updateAccommodationAction = useAction<UpdateAccommodationPricing, Accommodation>(
    updateAccommodationPricing(accommodation.id),
    { onSuccess, onError }
  );

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    update.priceDiffs.forEach((pd) => (pd.id = pd.id?.includes(".") ? undefined : pd.id));
    updateAccommodationAction(update);
  }

  return (
    <form onSubmit={onSubmit}>
      <PricingForm
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

export default PricingUpdateForm;
