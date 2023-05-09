import { type FC } from "react";
import { type Amenity } from "../AccommodationModels";
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
        <div className="flex space-x-2" key={a.id}>
          <div>
            <input
              id={a.id}
              type="checkbox"
              value={a.id}
              checked={amenities.some((am) => am.amenityId === a.id)}
              onChange={(e) =>
                updateFields({
                  amenities: e.target.checked
                    ? [...amenities, { amenityId: e.target.value, isPresent: true }]
                    : amenities.filter((am) => am.amenityId !== a.id),
                })
              }
            />
          </div>
          <label className="text-lg font-medium text-gray-700" htmlFor={a.id}>
            {a.name}
          </label>
        </div>
      ))}
    </>
  );
};
