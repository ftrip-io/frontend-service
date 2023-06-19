import { type FC } from "react";
import { AccommodationSearchInfo } from "./SearchFilterModels";
import { AccommodationSearchResultCard } from "./AccommodationSearchResultCard";

export const AccommodationSearchResults: FC<{
  accommodationSearchResults: AccommodationSearchInfo[];
}> = ({ accommodationSearchResults }) => {
  if (!accommodationSearchResults) return <></>;

  if (!accommodationSearchResults.length)
    return <h1 className="my-5 text-center">No search results.</h1>;

  return (
    <>
      {accommodationSearchResults?.map((accommodationInfo, i) => (
        <AccommodationSearchResultCard
          accommodationInfo={accommodationInfo}
          key={accommodationInfo.accommodationId}
        />
      ))}
    </>
  );
};
