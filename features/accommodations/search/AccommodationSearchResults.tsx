import { FC } from "react";
import { AccommodationSearchInfo } from "./SearchFilterModels";
import { AccommodationSearchResultCard } from "./AccommodationSearchResultCard";

export const AccommodationSearchResults: FC<{
  accommodationSearchResults: AccommodationSearchInfo[];
}> = ({ accommodationSearchResults }) => {
  if (!accommodationSearchResults) return <></>;

  if (!accommodationSearchResults.length) return <p>Nema rezultata pretrage.</p>;

  return (
    <>
      <ol>
        {accommodationSearchResults?.map(
          (accommodationInfo: AccommodationSearchInfo, i: number) => {
            return <AccommodationSearchResultCard accommodationInfo={accommodationInfo} key={i} />;
          }
        )}
      </ol>
    </>
  );
};
