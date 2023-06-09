import { type FC } from "react";
import { SelectOptionField } from "../../../core/components/SelectOptionField";
import { countries } from "../useCountries";
import { type CreateAccommodation } from "../accommodationActions";
import { type Location } from "../AccommodationModels";
import { SimpleTextInput } from "../../../core/components/SimpleTextInput";

type LocationFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  location: Location;
};

export const LocationForm: FC<LocationFormProps> = ({ updateFields, location }) => {
  const updateLocation = (fields: Partial<Location>) =>
    updateFields({ location: { ...location, ...fields, saved: false, latitude: 0, longitude: 0 } });

  return (
    <>
      <h3 className="text-xl mb-6 font-semibold">Where is your place located?</h3>
      <SelectOptionField
        label="Country"
        placeholder="Select one"
        options={countries.map((c) => ({ value: c, label: c }))}
        onChange={(value) => updateLocation({ country: value })}
        formElement={{ required: true }}
        value={location.country}
      />
      <SimpleTextInput
        label="State"
        value={location.region}
        onChange={(e) => updateLocation({ region: e.target.value })}
      />
      <SimpleTextInput
        label="City"
        value={location.city}
        onChange={(e) => updateLocation({ city: e.target.value })}
        required
      />
      <SimpleTextInput
        label="Address"
        value={location.address}
        onChange={(e) => updateLocation({ address: e.target.value })}
        required
      />
      <SimpleTextInput
        label="ZIP code"
        value={location.postalCode}
        onChange={(e) => updateLocation({ postalCode: e.target.value })}
        maxLength={10}
      />
      <SimpleTextInput
        label="Apt, Suite, (optional)"
        value={location.apt}
        onChange={(e) => updateLocation({ apt: e.target.value })}
      />
    </>
  );
};
