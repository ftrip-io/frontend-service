import { type FC, useState } from "react";
import { ReservationRequestStatus } from "./ReservationRequestsModels";
import { SelectOptionField } from "../../core/components/SelectOptionField";
import { DatepickerInput } from "../../core/components/DatepickerInput";

const statusOptions = [
  { value: "", label: "All" },
  { value: ReservationRequestStatus.Waiting, label: "Waiting" },
  { value: ReservationRequestStatus.Accepted, label: "Accepted" },
  { value: ReservationRequestStatus.Declined, label: "Declined" },
];

export type ReservationRequestsSearchFormProps = {
  initialFilters: any;
  onFiltersChange: (filters: any) => any;
};

export const ReservationRequestsSearchForm: FC<ReservationRequestsSearchFormProps> = ({
  initialFilters,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const { dateFrom, dateTo, status } = filters;

  const changeFilter = (newValues: any) => {
    const newFilters = { ...filters, ...newValues };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <SelectOptionField
          label="Status"
          options={statusOptions}
          value={status}
          onChange={(value) => changeFilter({ status: value })}
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
