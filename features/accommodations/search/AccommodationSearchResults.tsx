import { type FC } from "react";
import { AccommodationSearchInfo } from "./SearchFilterModels";
import { AccommodationSearchResultCard } from "./AccommodationSearchResultCard";

export const AccommodationSearchResults: FC<{
  accommodationSearchResults: AccommodationSearchInfo[];
}> = ({ accommodationSearchResults }) => {
  if (!accommodationSearchResults) return <></>;
  if (!accommodationSearchResults.length) return <p>No search results.</p>;

  return (
    <div className="md:grid md:grid-cols-2 gap-3">
      {accommodationSearchResults?.map((accommodationInfo, i) => (
        <AccommodationSearchResultCard accommodationInfo={accommodationInfo} key={i} />
      ))}
    </div>
  );
};
