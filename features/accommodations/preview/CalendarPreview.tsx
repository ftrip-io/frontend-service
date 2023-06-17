import { useState, type FC, useMemo } from "react";
import { type TileDisabledFunc } from "react-calendar/dist/cjs/shared/types";
import { type Availability } from "../AccommodationModels";
import Calendar from "react-calendar";
import moment, { invalid } from "moment";
import { Reservation } from "../../reservations/ReservationsModels";

type CheckPeriod = { checkIn?: Date; checkOut?: Date };

type CalendarPreviewProps = {
  bookingAdvancePeriod: number;
  availabilities: Availability[];
  reservations?: Reservation[];
  minDays: number;
  maxDays: number;
  value: CheckPeriod;
  onChange: (c: CheckPeriod) => void;
};

export const CalendarPreview: FC<CalendarPreviewProps> = ({
  bookingAdvancePeriod,
  availabilities,
  reservations,
  minDays,
  maxDays,
  value,
  onChange,
}) => {
  const [selectedRange, setSelectedRange] = useState<any>(
    value.checkIn && value.checkOut ? [value.checkIn, value.checkOut] : []
  );
  const [dates, setDates] = useState<{
    start?: Date;
    end?: Date;
    min?: Date;
    max?: Date;
    invalid?: boolean;
  }>({
    min: new Date(),
    start: value.checkIn,
    end: value.checkOut,
  });
  const bookingEnd = useMemo(
    () => moment().add(bookingAdvancePeriod, "months").toDate(),
    [bookingAdvancePeriod]
  );

  const dateDisabled = (date: Date) => {
    if (bookingAdvancePeriod >= 0 && (!bookingAdvancePeriod || date < bookingEnd))
      return (
        availabilities.some((a) => a.fromDate <= date && a.toDate >= date && !a.isAvailable) ||
        !!reservations?.some((r) => r.datePeriod.dateFrom <= date && r.datePeriod.dateTo >= date)
      );
    return (
      !availabilities.some((a) => a.fromDate <= date && a.toDate >= date && a.isAvailable) ||
      !!reservations?.some((r) => r.datePeriod.dateFrom <= date && r.datePeriod.dateTo >= date)
    );
  };

  const tileDisabled: TileDisabledFunc = ({ date }) => dateDisabled(date);

  const dateClick = (date: Date) => {
    if (!!dates.start === !!dates.end) {
      const maxD1 = moment(date).add(maxDays, "days").toDate();
      const maxD2 =
        availabilities.find((av) => av.fromDate > date && !av.isAvailable)?.fromDate ?? maxD1;
      const maxD3 =
        reservations?.find((r) => r.datePeriod.dateFrom > date)?.datePeriod.dateFrom ?? maxD2;
      setDates({
        start: date,
        min: date,
        max: maxD1 < maxD2 && maxD1 < maxD3 ? maxD1 : maxD2 < maxD3 ? maxD2 : maxD3,
      });
      onChange({ checkIn: date });
    } else if (date < moment(dates.start).add(minDays, "days").toDate()) {
      setDates({ start: dates.start, end: date, min: new Date(), invalid: true });
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
      <div className="mb-2">
        {dates.start ? (
          dates.end ? (
            dates.invalid ? (
              <>Minimum stay: {minDays} nights</>
            ) : (
              <>
                {moment(dates.start).format("MMM D, YYYY")} -{" "}
                {moment(dates.end).format("MMM D, YYYY")}
              </>
            )
          ) : (
            <>Select check-out date</>
          )
        ) : (
          <>Add your travel dates for exact pricing</>
        )}
      </div>
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
