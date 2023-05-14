import { type FC } from "react";
import { type CreateAccommodation } from "../createAccommodation";
import RadioGroup from "../../../core/components/RadioGroup";
import { SelectOptionField } from "../../../core/components/SelectOptionField";
import IntegerInput from "../../../core/components/IntegerInput";

type AvailabilityFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  noticePeriod: number;
  bookingAdvancePeriod: number;
  checkInFrom: number;
  checkInTo: number;
  bookBeforeTime: number;
  minNights: number;
  maxNights: number;
};

const hoursOptions = [...Array(24).keys()].map((i) => ({ value: i, label: i + ":00" }));

export const AvailabilityForm: FC<AvailabilityFormProps> = ({
  updateFields,
  noticePeriod,
  bookingAdvancePeriod,
  bookBeforeTime,
  checkInFrom,
  checkInTo,
  minNights,
  maxNights,
}) => {
  return (
    <>
      <h3 className="text-xl mb-4 font-semibold">
        How much notice do you need before a guest arrives?
      </h3>
      <RadioGroup
        options={[
          { value: "0", label: "Same day" },
          { value: "1", label: "1 day" },
          { value: "2", label: "2 days" },
          { value: "3", label: "3 days" },
          { value: "7", label: "7 days" },
        ]}
        name="notice-period"
        value={noticePeriod + ""}
        onChange={(v) => updateFields({ noticePeriod: +v })}
        formElement={{ required: true }}
      />
      <div className="w-1/3 pt-5">
        Guests can book before
        <SelectOptionField
          label=""
          options={hoursOptions}
          onChange={(value) => updateFields({ bookBeforeTime: +value })}
          formElement={{ required: true }}
          value={bookBeforeTime}
        />
      </div>
      <div className="w-1/2 pt-5">
        When can guests check in?
        <div className="flex">
          <div className="mr-2">
            From
            <SelectOptionField
              label=""
              options={hoursOptions}
              onChange={(value) => updateFields({ checkInFrom: +value })}
              formElement={{ required: true }}
              value={checkInFrom}
            />
          </div>
          <div className="mr-2">
            To
            <SelectOptionField
              label=""
              options={hoursOptions}
              onChange={(value) => updateFields({ checkInTo: +value })}
              formElement={{ required: true }}
              value={checkInTo}
            />
          </div>
        </div>
      </div>
      <h3 className="text-xl my-4 font-semibold">How far in advance can guests book?</h3>
      <RadioGroup
        options={[
          { value: "0", label: "Any time" },
          { value: "3", label: "3 months in advance" },
          { value: "6", label: "6 months in advance" },
          { value: "9", label: "9 months in advance" },
          { value: "12", label: "1 year in advance" },
          { value: "-1", label: "Dates unavailable by default" },
        ]}
        name="booking-advance-period"
        value={bookingAdvancePeriod + ""}
        onChange={(v) => updateFields({ bookingAdvancePeriod: +v })}
        formElement={{ required: true }}
      />
      <h3 className="text-xl my-4 font-semibold">How long can guests stay?</h3>
      <div className="flex mb-2">
        <IntegerInput
          onChange={(n) => updateFields({ minNights: n })}
          value={minNights}
          min={1}
          max={maxNights}
        />
        <span className="text-lg ml-3">nigths min</span>
      </div>
      <div className="flex mb-2">
        <IntegerInput
          onChange={(n) => updateFields({ maxNights: n })}
          value={maxNights}
          min={minNights}
          max={100}
        />
        <span className="text-lg ml-3">nights max</span>
      </div>
    </>
  );
};
