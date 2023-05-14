import { useState, type FC } from "react";
import { type CreateAccommodation } from "../createAccommodation";
import { type PriceDiff } from "../AccommodationModels";
import { Button } from "../../../core/components/Button";
import RadioGroup from "../../../core/components/RadioGroup";
import { MONTHS, WEEKDAYS, parseCronExpression, toCronExpression } from "../../../core/utils/cron";
import Select from "react-select";
import { TrashIcon } from "@heroicons/react/24/outline";

const monthOptions = MONTHS.map((m, i) => ({ value: i + 1, label: m }));
const monthDayOptions = [...Array(31).keys()].map((i) => ({ value: i + 1, label: i + 1 }));
const weekDayOptions = WEEKDAYS.map((d, i) => ({ value: i + 1, label: d }));

type PricingFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  price: number;
  isPerGuest: boolean;
  priceDiffs: PriceDiff[];
};

const PriceDiffForm: FC<{ priceDiff: PriceDiff; onChange: () => void; onDelete: () => void }> = ({
  priceDiff,
  onChange,
  onDelete,
}) => {
  const [when, setWhen] = useState(parseCronExpression(priceDiff.when || "0 0 * * *"));

  const updateWhen = (field: "monthDays" | "months" | "weekDays", newValues: number[]) => {
    let w = { ...when, [field]: newValues };
    priceDiff.when = toCronExpression(w.monthDays, w.months, w.weekDays);
    setWhen(w);
    onChange();
    console.log(priceDiff.when);
  };

  return (
    <div className="border-y py-3">
      <label className="block text-lg font-medium text-gray-700">When</label>
      <div className="grid lg:grid-cols-3">
        <Select
          placeholder="Any month"
          options={monthOptions}
          isMulti={true}
          onChange={(newV) =>
            updateWhen(
              "months",
              newV.map((v) => v.value)
            )
          }
          value={monthOptions.filter((o) => when.months.includes(o.value))}
        />
        <Select
          placeholder="Any day of month"
          options={monthDayOptions}
          isMulti={true}
          onChange={(newV) =>
            updateWhen(
              "monthDays",
              newV.map((v) => v.value)
            )
          }
          value={monthDayOptions.filter((o) => when.monthDays.includes(o.value))}
        />
        <Select
          placeholder="Any day of week"
          options={weekDayOptions}
          isMulti={true}
          onChange={(newV) =>
            updateWhen(
              "weekDays",
              newV.map((v) => v.value)
            )
          }
          value={weekDayOptions.filter((o) => when.weekDays.includes(o.value))}
        />
      </div>
      <div className="flex items-end">
        <div className="w-5/6">
          <label className="block text-lg font-medium text-gray-700">Difference %</label>
          <input
            type="number"
            className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xl"
            value={priceDiff.percentage}
            onChange={(e) => {
              priceDiff.percentage = +e.target.value;
              onChange();
            }}
            required
            step={0.01}
          />
        </div>
        <div className="w-1/6">
          <button
            type="button"
            onClick={onDelete}
            className="float-right m-2 bg-indigo-600 hover:bg-indigo-700 p-2 rounded-md"
          >
            <TrashIcon className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};
export const PricingForm: FC<PricingFormProps> = ({
  updateFields,
  price,
  isPerGuest,
  priceDiffs,
}) => {
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
        min={0.01}
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
      <h3 className="text-xl my-6 font-semibold">Price differences</h3>
      {priceDiffs.map((pd, i) => (
        <PriceDiffForm
          priceDiff={pd}
          onChange={() => updateFields({ priceDiffs })}
          onDelete={() => {
            priceDiffs.splice(i, 1);
            updateFields({ priceDiffs });
          }}
          key={pd.id}
        />
      ))}
      <Button
        className="my-4"
        type="button"
        onClick={() =>
          updateFields({
            priceDiffs: [
              ...priceDiffs,
              { percentage: 0, when: "0 0 * * *", id: Math.random() + "" },
            ],
          })
        }
      >
        Add price diff
      </Button>
    </>
  );
};
