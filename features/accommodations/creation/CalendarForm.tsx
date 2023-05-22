import { useState, type FC, useCallback } from "react";
import Calendar from "react-calendar";
import {
  type TileClassNameFunc,
  type TileDisabledFunc,
} from "react-calendar/dist/cjs/shared/types";
import { type CreateAccommodation } from "../accommodationActions";
import { type Availability } from "../AccommodationModels";
import { Button } from "../../../core/components/Button";
import RadioGroup from "../../../core/components/RadioGroup";

type CalendarFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  bookingAdvancePeriod: number;
  availabilities: Availability[];
};

const AVAILABLE_CLASS = "react-calendar__tile--available" as const;
const DISABLED_CLASS = "react-calendar__tile--disabled" as const;

const addAvailability = (
  start: Date,
  end: Date,
  isAvailable: boolean,
  availabilities: Availability[]
) => {
  let overlaps: Availability | undefined;
  let overlapped: Availability | undefined;
  let during: Availability | undefined;
  let included: Availability[] = [];
  const beforeStart = new Date(start);
  beforeStart.setDate(beforeStart.getDate() - 1);
  beforeStart.setHours(23, 59, 59, 999);
  const afterEnd = new Date(end);
  afterEnd.setDate(afterEnd.getDate() + 1);
  afterEnd.setHours(0, 0, 0, 0);

  for (const av of availabilities) {
    if (av.fromDate <= beforeStart) {
      if (av.toDate < beforeStart) continue;
      if (av.toDate > afterEnd) during = av;
      else overlaps = av;
    } else {
      if (av.fromDate > afterEnd) continue;
      if (av.toDate > afterEnd) overlapped = av;
      else included.push(av);
    }
  }

  if (during) {
    if (during.isAvailable === isAvailable) {
      return availabilities;
    } else {
      availabilities.push({
        fromDate: afterEnd,
        toDate: during.toDate,
        isAvailable: during.isAvailable,
      });
      during.toDate = beforeStart;
    }
  }
  let ignoreNew = false;
  if (overlaps) {
    if (overlaps.isAvailable === isAvailable) {
      overlaps.toDate = end;
      ignoreNew = true;
    } else {
      overlaps.toDate = beforeStart;
    }
  }
  if (overlapped) {
    if (overlapped.isAvailable === isAvailable) {
      if (overlaps && ignoreNew) {
        overlaps.toDate = overlapped.toDate;
        included.push(overlapped);
      } else {
        overlapped.fromDate = start;
        ignoreNew = true;
      }
    } else {
      overlapped.fromDate = afterEnd;
    }
  }
  if (!ignoreNew)
    availabilities.push({
      fromDate: start,
      toDate: end,
      isAvailable: isAvailable,
    });

  return availabilities.filter((av) => !included.includes(av));
};

export const CalendarForm: FC<CalendarFormProps> = ({
  updateFields,
  bookingAdvancePeriod,
  availabilities,
}) => {
  const [selectedRange, setSelectedRange] = useState<[Date, Date]>();

  const tileDisabled: TileDisabledFunc = useCallback(({ date, view }) => {
    return view === "month" && date < new Date();
  }, []);

  const tileClassName: TileClassNameFunc = ({ date, view }) => {
    if (view !== "month") return;

    let bookingEnd = new Date();
    bookingEnd.setMonth(bookingEnd.getMonth() + bookingAdvancePeriod);

    if (bookingAdvancePeriod >= 0 && (!bookingAdvancePeriod || date < bookingEnd))
      return availabilities.some((a) => a.fromDate <= date && a.toDate >= date && !a.isAvailable)
        ? DISABLED_CLASS
        : AVAILABLE_CLASS;
    return availabilities.some((a) => a.fromDate <= date && a.toDate >= date && a.isAvailable)
      ? AVAILABLE_CLASS
      : DISABLED_CLASS;
  };

  const saveSelection = (isAvailable: boolean) => {
    if (!selectedRange) return;
    updateFields({
      availabilities: addAvailability(
        selectedRange[0],
        selectedRange[1],
        isAvailable,
        availabilities
      ),
    });
    setSelectedRange(undefined);
  };

  return (
    <>
      <h3 className="text-xl mb-4 font-semibold">Set your availability</h3>
      <div className="flex my-6">
        <div>
          <Calendar
            tileDisabled={tileDisabled}
            tileClassName={tileClassName}
            selectRange
            onChange={(v) => setSelectedRange(v as [Date, Date])}
          />
        </div>
        {selectedRange && (
          <div>
            <Button type="button" onClick={() => saveSelection(false)} className="m-2">
              Block interval
            </Button>
            <Button type="button" onClick={() => saveSelection(true)} className="m-2">
              Unblock interval
            </Button>
            <Button type="button" onClick={() => setSelectedRange(undefined)} className="m-2">
              Clear selection
            </Button>
          </div>
        )}
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
    </>
  );
};
