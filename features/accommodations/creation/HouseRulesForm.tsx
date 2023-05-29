import { type FC } from "react";
import { type CreateAccommodation } from "../accommodationActions";

type HouseRulesFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  houseRules: string;
};

export const HouseRulesForm: FC<HouseRulesFormProps> = ({ updateFields, houseRules }) => {
  return (
    <>
      <h3 className="text-xl mb-6 font-semibold">Set house rules for your guests</h3>
      <textarea
        className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
        value={houseRules}
        onChange={(e) => updateFields({ houseRules: e.target.value })}
        rows={10}
        required
      />
    </>
  );
};
