import { type FC, useCallback, useEffect, useState } from "react";
import { useHostReviewsSummary } from "./useHostReviewsSummary";
import { useHostReviews } from "./useHostReviews";
import moment from "moment";
import { Button } from "../../../core/components/Button";
import { PageResult } from "../../../types";
import debounce from "lodash.debounce";
import { InputField } from "../../../core/components/InputField";
import { Star } from "../Star";
import Link from "next/link";
import { Grade } from "../Grade";
import { useUsersMap } from "../../users/useUsersMap";
import type { HostReview, HostGradesSummary } from "./HostReviewModels";

const SummaryGradesHeader: FC<{ grades: HostGradesSummary }> = ({ grades }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Grade title="Communication" grade={grades.communication} />
      <Grade title="Overall" grade={grades.overall} />
    </div>
  );
};

const HostReview: FC<{ review: HostReview }> = ({ review }) => {
  return (
    <>
      <li className="mb-10 ml-6">
        <span className="flex absolute -left-4 mt-5 justify-center items-center w-8 h-8 bg-blue-200 rounded-full ring-8 ring-white" />
        <div className="py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="mb-2">
            <div className="flex space-x-1 ">
              <Link href={`/users/${review.guestId}`}>{review.guest} gradded this host with </Link>
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

const HostReviewsPage: FC<{
  reviewsPage: PageResult<HostReview>;
  onLoadMore: any;
}> = ({ reviewsPage, onLoadMore }) => {
  const { entities: reviews, totalEntities } = reviewsPage || {};

  const guestIds = reviews?.map((review) => review.guestId) ?? [];
  const { usersMap: guestsMap } = useUsersMap(guestIds);

  return (
    <>
      <ol className="relative border-l border-gray-200">
        {reviews.map((review: HostReview, i: number) => {
          const guest = guestsMap[review.guestId];
          review.guest = `${guest?.firstName} ${guest?.lastName}`;

          return <HostReview review={review} key={i} />;
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

type HostReviewsProps = {
  hostId: string;
};

export const HostReviews: FC<HostReviewsProps> = ({ hostId }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [finalSearch, setFinalSearch] = useState(search);

  const { summary, isLoading: isSummaryLoading } = useHostReviewsSummary(hostId);
  const { reviewsPage, isLoading: areReviewsLoading } = useHostReviews({
    hostId,
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

        <HostReviewsPage reviewsPage={reviewsPage} onLoadMore={loadMore} />
      </div>
    </>
  );
};
