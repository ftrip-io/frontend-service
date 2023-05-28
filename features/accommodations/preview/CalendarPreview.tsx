import { useState, type FC, useCallback } from "react";
import { TileClassNameFunc, type TileDisabledFunc } from "react-calendar/dist/cjs/shared/types";
import { Availability } from "../AccommodationModels";
import Calendar from "react-calendar";
import moment from "moment";

type CalendarPreviewProps = {
  bookingAdvancePeriod: number;
  availabilities: Availability[];
  minDays: number;
  maxDays: number;
  onChange: (c: { checkIn?: Date; checkOut?: Date }) => void;
};

const AVAILABLE_CLASS = "react-calendar__tile--available" as const;
const DISABLED_CLASS = "react-calendar__tile--disabled" as const;

export const CalendarPreview: FC<CalendarPreviewProps> = ({
  bookingAdvancePeriod,
  availabilities,
  minDays,
  maxDays,
  onChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<any>();
  const [dates, setDates] = useState<{ start?: Date; end?: Date; min?: Date; max?: Date }>({
    min: new Date(),
  });

  const dateDisabled = (date: Date) => {
    let bookingEnd = new Date();
    bookingEnd.setMonth(bookingEnd.getMonth() + bookingAdvancePeriod);
    if (bookingAdvancePeriod >= 0 && (!bookingAdvancePeriod || date < bookingEnd))
      return availabilities.some((a) => a.fromDate <= date && a.toDate >= date && !a.isAvailable);
    return !availabilities.some((a) => a.fromDate <= date && a.toDate >= date && a.isAvailable);
  };

  const tileDisabled: TileDisabledFunc = ({ date }) => dateDisabled(date);

  const tileClassName: TileClassNameFunc = ({ date }) => {
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

  const dateClick = (date: Date) => {
    if (!!dates.start === !!dates.end) {
      let maxD1 = moment(date).add(maxDays, "days").toDate();
      let maxD2 =
        availabilities.find((av) => av.fromDate > date && !av.isAvailable)?.fromDate ?? maxD1;
      setDates({ start: date, min: date, max: maxD1 < maxD2 ? maxD1 : maxD2 });
      onChange({ checkIn: date });
    } else {
      setDates({ start: dates.start, end: date, min: new Date() });
      onChange({ checkIn: dates.start, checkOut: date });
    }
  };

  const clear = () => {
    setSelectedRange([]);
    setDates({ min: new Date() });
    onChange({});
  };

  return (
    <div>
      {dates.start && dates.end && (
        <div>
          {moment(dates.start).format("MMM D, YYYY")} - {moment(dates.end).format("MMM D, YYYY")}
        </div>
      )}
      <Calendar
        tileDisabled={tileDisabled}
        // tileClassName={tileClassName}
        value={selectedRange}
        selectRange
        onChange={setSelectedRange}
        minDate={dates.min}
        maxDate={dates.max}
        showDoubleView={true}
        onClickDay={dateClick}
        minDetail="month"
      />
      <button onClick={clear}>Clear dates</button>
    </div>
  );
};
