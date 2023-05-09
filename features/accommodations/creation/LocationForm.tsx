import { ChangeEvent, type FC } from "react";
import { SelectOptionField } from "../../../core/components/SelectOptionField";
import { countries } from "../useCountries";
import { type CreateAccommodation } from "../createAccommodation";
import { type Location } from "../AccommodationModels";

type LocationFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  location: Location;
};

export const LocationForm: FC<LocationFormProps> = ({ updateFields, location }) => {
  const updateLocation = (fields: Partial<Location>) =>
    updateFields({ location: { ...location, ...fields, saved: false, latitude: 0, longitude: 0 } });

  return (
    <>
      <SelectOptionField
        label="Country"
        placeholder="Select one"
        options={countries.map((c) => ({
          value: c,
          label: c,
        }))}
        formElement={{
          onChange: (e: ChangeEvent<HTMLInputElement>) =>
            updateLocation({ country: e.target.value }),
          required: true,
        }}
        value={location.country}
      />
      <label className="block text-lg font-medium text-gray-700 mt-5">State</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={location.region}
        onChange={(e) => updateLocation({ region: e.target.value })}
      />
      <label className="block text-lg font-medium text-gray-700 mt-5">City</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={location.city}
        onChange={(e) => updateLocation({ city: e.target.value })}
        required
      />
      <label className="block text-lg font-medium text-gray-700 mt-5">Address</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={location.address}
        onChange={(e) => updateLocation({ address: e.target.value })}
        required
      />
      <label className="block text-lg font-medium text-gray-700 mt-5">Zip code</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={location.postalCode}
        onChange={(e) => updateLocation({ postalCode: e.target.value })}
        maxLength={10}
      />
      <label className="block text-lg font-medium text-gray-700 mt-5">Apt, Suite, (optional)</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={location.apt}
        onChange={(e) => updateLocation({ apt: e.target.value })}
      />
    </>
  );
};
