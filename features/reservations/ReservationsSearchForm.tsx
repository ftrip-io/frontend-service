import { type FC, useState } from "react";
import { SelectOptionField } from "../../core/components/SelectOptionField";
import { DatepickerInput } from "../../core/components/DatepickerInput";

const includeOptions = [
  { value: "1", label: "All" },
  { value: "0", label: "Not cancelled" },
];

export type ReservationsSearchFormProps = {
  initialFilters: any;
  onFiltersChange: (filters: any) => any;
};

export const ReservationsSearchForm: FC<ReservationsSearchFormProps> = ({
  initialFilters,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const { dateFrom, dateTo, includeCancelled } = filters;

  const changeFilter = (newValues: any) => {
    const newFilters = { ...filters, ...newValues };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <SelectOptionField
          label="Include"
          options={includeOptions}
          value={includeCancelled}
          onChange={(value) => changeFilter({ includeCancelled: value })}
        />

        <DatepickerInput
          label="From"
          value={dateFrom}
          onChange={(value) => changeFilter({ dateFrom: value })}
        />

        <DatepickerInput
          label="To"
          value={dateTo}
          onChange={(value) => changeFilter({ dateTo: value })}
        />
      </div>
    </>
  );
};
