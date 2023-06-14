import { FC, useState } from "react";
import { DatepickerInput } from "../../../core/components/DatepickerInput";
import { SimpleTextInput } from "../../../core/components/SimpleTextInput";
import IntegerInput from "../../../core/components/IntegerInput";
import { Button } from "../../../core/components/Button";

export type SearchAccommodationsFormProps = {
  initialFilters: any;
  onFiltersChange: (filters: any) => any;
};

export const AccommodationSearchForm: FC<SearchAccommodationsFormProps> = ({
  initialFilters,
  onFiltersChange,
}) => {
  const [filters, setFilters] = useState(initialFilters);
  const { location, fromDate, toDate, guestNum } = filters;

  const changeFilter = (newValues: any) => {
    setFilters({ ...filters, ...newValues });
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        <div>
          <SimpleTextInput
            label="Location"
            value={location}
            onChange={(e) => changeFilter({ location: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-lg font-medium text-gray-700">Guest Number: </label>
          <IntegerInput value={guestNum} onChange={(value) => changeFilter({ guestNum: value })} />
        </div>
        <div>
          <DatepickerInput
            label="From"
            value={fromDate}
            onChange={(value) => changeFilter({ fromDate: value })}
          />
        </div>
        <div>
          <DatepickerInput
            label="To"
            value={toDate}
            onChange={(value) => changeFilter({ toDate: value })}
          />
        </div>
        <div>
          <Button onClick={() => onFiltersChange(filters)}>Search</Button>
        </div>
      </div>
    </>
  );
};
