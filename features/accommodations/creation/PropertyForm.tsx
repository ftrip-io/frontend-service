import { type FC } from "react";
import { PlaceType, type PropertyType } from "../AccommodationModels";
import { SelectOptionField } from "../../../core/components/SelectOptionField";
import { type CreateAccommodation } from "../createAccommodation";
import RadioGroup from "../../../core/components/RadioGroup";

type PropertyFormProps = {
  allPropertyTypes: PropertyType[];
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  propertyTypeId: string;
  placeType: PlaceType;
  isDecicatedForGuests: boolean;
};

export const PropertyForm: FC<PropertyFormProps> = ({
  allPropertyTypes,
  updateFields,
  propertyTypeId,
  placeType,
  isDecicatedForGuests,
}) => {
  return (
    <>
      <h3 className="text-xl mb-6 font-semibold">What kind of place are you listing?</h3>

      <div className="mb-5">
        <SelectOptionField
          label="Choose a property type"
          placeholder="Select one"
          options={allPropertyTypes?.map((pt) => ({ value: pt.id, label: pt.name }))}
          onChange={(value) => updateFields({ propertyTypeId: value })}
          formElement={{ required: true }}
          value={propertyTypeId}
        />
      </div>
      <div className="mb-5">
        <SelectOptionField
          label="Confirm the type of place guests will have"
          options={[
            { value: PlaceType.ENTIRE_PLACE, label: "Entire place" },
            { value: PlaceType.PRIVATE_ROOM, label: "Private room" },
            { value: PlaceType.SHARED_ROOM, label: "Shared room" },
          ]}
          onChange={(value) => updateFields({ placeType: +value })}
          formElement={{ required: true }}
          value={placeType}
        />
      </div>
      <div className="mb-5">
        <label className="block text-lg font-medium text-gray-700">
          Is this set up as a dedicated guest space?
        </label>
        <RadioGroup
          options={[
            { value: "true", label: "Yes, it's primarly set up for guests" },
            { value: "false", label: "No, I keep my personal belongings here" },
          ]}
          name="dgs"
          value={isDecicatedForGuests + ""}
          onChange={(v) => updateFields({ isDecicatedForGuests: v === "true" })}
          formElement={{ required: true }}
        />
      </div>
    </>
  );
};
