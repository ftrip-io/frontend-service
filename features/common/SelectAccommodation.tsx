import { type FC } from "react";
import { type Accommodation } from "../accommodations/AccommodationModels";
import { useAccommodationsMap } from "../accommodations/useAccommodationsMap";
import { SelectOptionField } from "../../core/components/SelectOptionField";

export type SelectAccomodationProps = {
  accommodations: Accommodation[];
  accommodationId: string;
  onAccommodationSelected: (accommodationId: string) => any;
};

export const SelectAccomodation: FC<SelectAccomodationProps> = ({
  accommodations,
  accommodationId,
  onAccommodationSelected,
}) => {
  // NOTE: FIX THIS
  const accommodationIds = accommodations?.map(
    (accommodation: any) => accommodation.accommodationId
  );
  const { accommodationsMap } = useAccommodationsMap(accommodationIds);

  const accommodationOptions = accommodations?.map((accommodation: any) => ({
    label: accommodationsMap[accommodation.accommodationId]?.title,
    value: accommodation.accommodationId,
  }));

  return (
    <>
      <SelectOptionField
        label="Accommodation"
        options={accommodationOptions}
        value={accommodationId}
        onChange={onAccommodationSelected}
      />
    </>
  );
};
