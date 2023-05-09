import { ChangeEvent, type FC } from "react";
import { type CreateAccommodation } from "../createAccommodation";
import RadioGroup from "../../../core/components/RadioGroup";
import { SelectOptionField } from "../../../core/components/SelectOptionField";

type AvailabilityFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  noticePeriod: number;
  bookingAdvancePeriod: number;
  checkInFrom: number;
  checkInTo: number;
  bookBeforeTime: number;
  minNights: number;
  maxNights: number;
  availabilities: any[];
};

export const AvailabilityForm: FC<AvailabilityFormProps> = ({
  updateFields,
  noticePeriod,
  bookingAdvancePeriod,
  bookBeforeTime,
  checkInFrom,
  checkInTo,
  minNights,
  maxNights,
  availabilities,
}) => {
  const hoursOptions = [...Array(24).keys()].map((i) => ({ value: i, label: i + ":00" }));
  return (
    <>
      <h3 className="text-xl mb-3">How much notice do you need before a guest arrives?</h3>
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
        <SelectOptionField
          label="Guests can book before"
          options={hoursOptions}
          formElement={{
            onChange: (e: ChangeEvent<HTMLInputElement>) =>
              updateFields({ bookBeforeTime: +e.target.value }),
            required: true,
          }}
          value={bookBeforeTime}
        />
      </div>
      <div className="w-1/2 pt-5">
        When can guests check in?
        <div className="flex">
          <div>
            <SelectOptionField
              label="From"
              options={hoursOptions}
              formElement={{
                onChange: (e: ChangeEvent<HTMLInputElement>) =>
                  updateFields({ checkInFrom: +e.target.value }),
                required: true,
              }}
              value={checkInFrom}
            />
          </div>
          <div>
            <SelectOptionField
              label="To"
              options={hoursOptions}
              formElement={{
                onChange: (e: ChangeEvent<HTMLInputElement>) =>
                  updateFields({ checkInTo: +e.target.value }),
                required: true,
              }}
              value={checkInTo}
            />
          </div>
        </div>
      </div>
    </>
  );
};
