import { FC, useCallback, useState } from "react";
import { useSearchAvailableAccommodations } from "./useAccommodationSearch";
import { AccommodationSearchResults } from "./AccommodationSearchResults";
import { AccommodationSearchForm } from "./AccommodationSearchForm";
import moment from "moment";
import { useRouter } from "next/router";
import { addQueryParam } from "../../../core/utils/router";

export const AccommodationSearchPage: FC = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<any>({
    location: router.query?.location?.toString() ?? "",
    guestNum: router.query?.guestNum?.toString() ?? 1,
    fromDate: router.query?.fromDate?.toString() ?? moment().add(1, "day").format("yyyy-MM-DD"),
    toDate: router.query?.toDate?.toString() ?? moment().add(2, "day").format("yyyy-MM-DD"),
  });

  const { accommodationSearchResults } = useSearchAvailableAccommodations(filters);

  const onQueryChange = useCallback(
    (newValues: any) => {
      setFilters(newValues);
      addQueryParam(router, {
        location: newValues.location,
        fromDate: newValues.fromDate,
        toDate: newValues.toDate,
        guestNum: newValues.guestNum,
      });
    },
    [router]
  );
  return (
    <>
      <div>
        <AccommodationSearchForm initialFilters={filters} onFiltersChange={onQueryChange} />
        <AccommodationSearchResults accommodationSearchResults={accommodationSearchResults} />
      </div>
    </>
  );
};
