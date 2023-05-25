import { useState, type FC, useCallback } from "react";
import { TileClassNameFunc, type TileDisabledFunc } from "react-calendar/dist/cjs/shared/types";
import { Availability } from "../AccommodationModels";
import Calendar from "react-calendar";

type CalendarPreviewProps = {
  bookingAdvancePeriod: number;
  availabilities: Availability[];
};

const AVAILABLE_CLASS = "react-calendar__tile--available" as const;
const DISABLED_CLASS = "react-calendar__tile--disabled" as const;

export const CalendarPreview: FC<CalendarPreviewProps> = ({
  bookingAdvancePeriod,
  availabilities,
}) => {
  const [selectedRange, setSelectedRange] = useState<[Date, Date]>();

  const tileDisabled: TileDisabledFunc = useCallback(({ date }) => {
    return date < new Date();
  }, []);

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
  return (
    <div>
      <Calendar
        tileDisabled={tileDisabled}
        tileClassName={tileClassName}
        selectRange
        onChange={(v) => setSelectedRange(v as [Date, Date])}
        minDate={new Date()}
        showDoubleView={true}
        minDetail="month"
      />
    </div>
  );
};
