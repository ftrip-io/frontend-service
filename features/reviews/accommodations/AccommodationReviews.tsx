import { type FC, useCallback, useEffect, useState } from "react";
import { useAccomodationReviewsSummary } from "./useAccomodationReviewsSummary";
import { useAccomodationReviews } from "./useAccommodationReviews";
import moment from "moment";
import { Button } from "../../../core/components/Button";
import { PageResult } from "../../../types";
import debounce from "lodash.debounce";
import { InputField } from "../../../core/components/InputField";
import { Star } from "../Star";
import Link from "next/link";
import { Grade } from "../Grade";
import { useUsersMap } from "../../users/useUsersMap";
import type { AccomodationGradesSummary, AccomodationReview } from "./AccommodationReviewModels";

const SummaryGradesHeader: FC<{ grades: AccomodationGradesSummary }> = ({ grades }) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <Grade title="Accommodation" grade={grades.accomodation} />
      <Grade title="Location" grade={grades.location} />
      <Grade title="Value for money" grade={grades.valueForMoney} />
    </div>
  );
};

const AccommodationReview: FC<{ review: AccomodationReview }> = ({ review }) => {
  return (
    <>
      <li className="mb-10 ml-6">
        <span className="flex absolute -left-4 mt-5 justify-center items-center w-8 h-8 bg-blue-200 rounded-full ring-8 ring-white" />
        <div className="py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="mb-2">
            <div className="flex space-x-1 ">
              <Link href={`/users/${review.guestId}`}>
                {review.guest} gradded this accommodation with{" "}
              </Link>
              <div className="flex items-center">
                {review.grades.average.toPrecision(3)} <Star />
              </div>
            </div>
            <p className="text-sm text-gray-700">{moment(review.createdAt).fromNow()}</p>
          </div>

          {review.recension.text}
        </div>
      </li>
    </>
  );
};

const AccommodationReviewsPage: FC<{
  reviewsPage: PageResult<AccomodationReview>;
  onLoadMore: any;
}> = ({ reviewsPage, onLoadMore }) => {
  const { entities: reviews, totalEntities } = reviewsPage;
  const guestIds = reviews?.map((review) => review.guestId) ?? [];
  const { usersMap: guestsMap } = useUsersMap(guestIds);

  return (
    <>
      <ol className="relative border-l border-gray-200">
        {reviews.map((review: AccomodationReview, i: number) => {
          const guest = guestsMap[review.guestId];
          review.guest = `${guest?.firstName} ${guest?.lastName}`;

          return <AccommodationReview review={review} key={i} />;
        })}
      </ol>

      {reviews.length !== totalEntities && (
        <div className="flex justify-center">
          <Button onClick={onLoadMore}>Load More</Button>
        </div>
      )}
    </>
  );
};

const debouncedCb = debounce((cb: () => void) => cb(), 300);

type AccommodationReviewsProps = {
  accommodationId: string;
};

export const AccommodationReviews: FC<AccommodationReviewsProps> = ({ accommodationId }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [finalSearch, setFinalSearch] = useState(search);

  const { summary, isLoading: isSummaryLoading } = useAccomodationReviewsSummary(accommodationId);
  const { reviewsPage, isLoading: areReviewsLoading } = useAccomodationReviews({
    accommodationId,
    page,
    search: finalSearch,
  });

  const loadMore = useCallback(() => setPage((page) => page + 1), [setPage]);

  useEffect(() => {
    debouncedCb(() => setFinalSearch(search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  if (isSummaryLoading || areReviewsLoading) return <></>;

  return (
    <>
      <div>
        <SummaryGradesHeader grades={summary.grades} />
      </div>

      <div className="mt-10 space-y-5">
        <InputField
          label="Search"
          formElement={{
            value: search,
            onChange: (e: any) => setSearch(e.target.value),
          }}
        />

        <AccommodationReviewsPage reviewsPage={reviewsPage} onLoadMore={loadMore} />
      </div>
    </>
  );
};
