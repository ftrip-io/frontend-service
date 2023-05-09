import { type FC } from "react";
import IntegerInput from "../../../core/components/IntegerInput";
import { type CreateAccommodation } from "../createAccommodation";

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
