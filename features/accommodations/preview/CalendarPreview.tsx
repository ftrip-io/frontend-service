import { useState, type FC, useMemo } from "react";
import { type TileDisabledFunc } from "react-calendar/dist/cjs/shared/types";
import { type Availability } from "../AccommodationModels";
import Calendar from "react-calendar";
import moment from "moment";

type CheckPeriod = { checkIn?: Date; checkOut?: Date };

type CalendarPreviewProps = {
  bookingAdvancePeriod: number;
  availabilities: Availability[];
  minDays: number;
  maxDays: number;
  value: CheckPeriod;
  onChange: (c: CheckPeriod) => void;
};

export const CalendarPreview: FC<CalendarPreviewProps> = ({
  bookingAdvancePeriod,
  availabilities,
  minDays,
  maxDays,
  value,
  onChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<any>(
    value.checkIn && value.checkOut ? [value.checkIn, value.checkOut] : []
  );
  const [dates, setDates] = useState<{ start?: Date; end?: Date; min?: Date; max?: Date }>({
    min: new Date(),
    start: value.checkIn ?? undefined,
    end: value.checkOut ?? undefined,
  });
  const bookingEnd = useMemo(
    () => moment().add(bookingAdvancePeriod, "months").toDate(),
    [bookingAdvancePeriod]
  );

  const dateDisabled = (date: Date) => {
    if (bookingAdvancePeriod >= 0 && (!bookingAdvancePeriod || date < bookingEnd))
      return availabilities.some((a) => a.fromDate <= date && a.toDate >= date && !a.isAvailable);
    return !availabilities.some((a) => a.fromDate <= date && a.toDate >= date && a.isAvailable);
  };

  const tileDisabled: TileDisabledFunc = ({ date }) => dateDisabled(date);

  const dateClick = (date: Date) => {
    if (!!dates.start === !!dates.end) {
      const maxD1 = moment(date).add(maxDays, "days").toDate();
      const maxD2 =
        availabilities.find((av) => av.fromDate > date && !av.isAvailable)?.fromDate ?? maxD1;
      setDates({ start: date, min: date, max: maxD1 < maxD2 ? maxD1 : maxD2 });
      onChange({ checkIn: date });
    } else {
      setDates({ start: dates.start, end: date, min: new Date() });
      onChange({ checkIn: dates.start, checkOut: date });
    }
    // TODO minDate constraint
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
