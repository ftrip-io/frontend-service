import { type FC } from "react";
import { type CreateAccommodation } from "../createAccommodation";
import RadioGroup from "../../../core/components/RadioGroup";

type PricingFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  price: number;
  isPerGuest: boolean;
};

export const PricingForm: FC<PricingFormProps> = ({ updateFields, price, isPerGuest }) => {
  return (
    <>
      <h3 className="text-xl mb-6 font-semibold">Price your space</h3>
      <label className="block text-lg font-medium text-gray-700 mt-5">Price</label>
      <input
        type="number"
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={price}
        onChange={(e) => updateFields({ price: +e.target.value })}
        required
        min={0}
        step={0.01}
      />

      <label className="block text-lg font-medium text-gray-700 mt-5">
        Is this price per guest?
      </label>
      <RadioGroup
        options={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ]}
        name="is-per-guest"
        value={isPerGuest + ""}
        onChange={(v) => updateFields({ isPerGuest: v === "true" })}
        formElement={{ required: true }}
      />
    </>
  );
};
