import { type FC } from "react";
import { SelectOptionField } from "../../core/components/SelectOptionField";
import { type AccommodationSearchInfo } from "../accommodations/search/SearchFilterModels";

export type SelectAccomodationProps = {
  accommodations: AccommodationSearchInfo[];
  accommodationId: string;
  onAccommodationSelected: (accommodationId: string) => any;
};

export const SelectAccomodation: FC<SelectAccomodationProps> = ({
  accommodations,
  accommodationId,
  onAccommodationSelected,
}) => {
  const accommodationOptions = accommodations?.map((accommodation) => ({
    label: accommodation.title,
    value: accommodation.accommodationId,
  }));

  return (
    <SelectOptionField
      label="Accommodation"
      options={accommodationOptions}
      value={accommodationId}
      onChange={onAccommodationSelected}
    />
  );
};
