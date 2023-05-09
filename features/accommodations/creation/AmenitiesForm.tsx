import { ChangeEvent, type FC } from "react";
import { type Amenity } from "../AccommodationModels";
import { Checkbox } from "../../../core/components/Checkbox";
import { type AmenitiesList, type CreateAccommodation } from "../createAccommodation";

type AmenitiesFormProps = {
  allAmenities: Amenity[];
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  amenities: AmenitiesList;
};

export const AmenitiesForm: FC<AmenitiesFormProps> = ({
  allAmenities,
  updateFields,
  amenities,
}) => {
  return (
    <>
      {allAmenities?.map((a) => (
        <Checkbox
          label={a.name}
          value={a.id}
          checked={amenities.some((am) => am.amenityId === a.id)}
          formElement={{
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              updateFields({
                amenities: e.target.checked
                  ? [...amenities, { amenityId: e.target.value, isPresent: true }]
                  : amenities.filter((am) => am.amenityId !== a.id),
              });
            },
          }}
          key={a.id}
        ></Checkbox>
      ))}
    </>
  );
};
