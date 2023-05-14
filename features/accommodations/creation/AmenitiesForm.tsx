import { type FC } from "react";
import { type Amenity } from "../AccommodationModels";
import { type AmenitiesList, type CreateAccommodation } from "../createAccommodation";

type AmenitiesFormProps = {
  allAmenities: Map<string, Amenity[]>;
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
      <h3 className="text-xl mb-6 font-semibold">What amenities do you offer?</h3>
      {[...allAmenities?.keys()].map((at) => (
        <div key={at}>
          <h4 className="text-lg font-medium text-gray-700 mt-3">{at}</h4>
          {allAmenities.get(at)?.map((a) => (
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
                <div className="text-xs text-gray-400">{a.description}</div>
              </label>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};
