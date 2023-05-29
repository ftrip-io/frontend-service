import { type FC } from "react";
import IntegerInput from "../../../core/components/IntegerInput";
import { type CreateAccommodation } from "../accommodationActions";

type RoomsFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  minGuests: number;
  maxGuests: number;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
};

export const RoomsForm: FC<RoomsFormProps> = ({
  updateFields,
  minGuests,
  maxGuests,
  bedroomCount,
  bedCount,
  bathroomCount,
}) => {
  return (
    <>
      <h3 className="text-xl mb-6 font-semibold">How many guests can your place accommodate?</h3>
      <div className="grid grid-cols-2 gap-y-4">
        Min guests
        <IntegerInput
          onChange={(n) => updateFields({ minGuests: n })}
          value={minGuests}
          min={1}
          max={maxGuests}
        />
        Max guests
        <IntegerInput
          onChange={(n) => updateFields({ maxGuests: n })}
          value={maxGuests}
          min={minGuests}
          max={10}
        />
        Bedrooms
        <IntegerInput
          onChange={(n) => updateFields({ bedroomCount: n })}
          value={bedroomCount}
          min={0}
        />
        Beds
        <IntegerInput onChange={(n) => updateFields({ bedCount: n })} value={bedCount} min={0} />
        Bathrooms
        <IntegerInput
          onChange={(n) => updateFields({ bathroomCount: n })}
          value={bathroomCount}
          min={0}
        />
      </div>
    </>
  );
};
