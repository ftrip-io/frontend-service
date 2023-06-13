import debounce from "lodash.debounce";
import { type FC, useCallback, useEffect, useState } from "react";
import { useAccomodationReviews } from "./useAccommodationReviews";
import { InputField } from "../../../core/components/InputField";
import { PageResult } from "../../../types";
import { Button } from "../../../core/components/Button";
import moment from "moment";
import { PencilIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { useReviewsResult } from "../useReviewsResult";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { deleteAccommodationReview } from "./accommodationReviewActions";
import { useAction } from "../../../core/hooks/useAction";
import { extractErrorMessage } from "../../../core/utils/errors";
import { ResultStatus } from "../../../core/contexts/Result";
import Link from "next/link";
import { Star } from "../Star";
import { AccommodationsReviewForm } from "./AccommodationsReviewForm";
import { Modal } from "../../../core/components/Modal";
import { UserSpecific } from "../../../core/components/UserSpecific";
import { useAccommodationsMap } from "../../accommodations/useAccommodationsMap";
import { type AccomodationReview } from "./AccommodationReviewModels";

type GuestAccommodationReviewProps = {
  review: AccomodationReview;
  onEditClick: () => any;
  onDeleteClick: () => any;
};

const GuestAccommodationReview: FC<GuestAccommodationReviewProps> = ({
  review,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <>
      <li className="mb-10 ml-6">
        <div className="py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex min-w-full">
            <div className="mb-2 flex-grow">
              <div className="flex space-x-1 ">
                <div className="flex items-center">
                  Gave {review.grades.average.toPrecision(3)} <Star />
                </div>
                <Link href={`/accommodations/${review.accomodationId}`}>
                  for {review.accommodation}
                </Link>
              </div>

              <p className="text-sm text-gray-700">{moment(review.createdAt).fromNow()}</p>
            </div>

            <UserSpecific userId={review.guestId}>
              <div className="space-x-2 justify-end">
                <PencilIcon className="inline-block h-5 w-5" onClick={onEditClick} />
                <XCircleIcon className="inline-block h-5 w-5" onClick={onDeleteClick} />
              </div>
            </UserSpecific>
          </div>

          {review.recension.text}
        </div>
      </li>
    </>
  );
};

const GuestAccommodationReviewsPage: FC<{
  reviewsPage: PageResult<AccomodationReview>;
  onEdit: (review: AccomodationReview) => any;
  onLoadMore: any;
}> = ({ reviewsPage, onEdit, onLoadMore }) => {
  const { entities: reviews, totalEntities } = reviewsPage || {};
  const accommodationIds = reviews?.map((review) => review.accomodationId) ?? [];

  const { accommodationsMap } = useAccommodationsMap(accommodationIds);

  const notificationsService = useNotifications();
  const { setResult } = useReviewsResult();

  const deleteReviewAction = useAction<string>(deleteAccommodationReview, {
    onSuccess: () => {
      notificationsService.success("You have successfully deleted review.");
      setResult({ status: ResultStatus.Ok, type: "DELETE_REVIEW" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "DELETE_REVIEW" });
    },
  });

  return (
    <>
      <ol className="relative border-l border-gray-200">
        {reviews.map((review: AccomodationReview, i: number) => {
          const accommodation = accommodationsMap[review.accomodationId];
          review.accommodation = accommodation?.title;

          return (
            <GuestAccommodationReview
              review={review}
              onEditClick={() => onEdit(review)}
              onDeleteClick={() => deleteReviewAction(review.id)}
              key={i}
            />
          );
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

type GuestAccommodationReviewsProps = {
  guestId: string;
};

export const GuestAccommodationReviews: FC<GuestAccommodationReviewsProps> = ({ guestId }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [finalSearch, setFinalSearch] = useState(search);
  const [isModalVisisble, setModalVisibility] = useState(false);
  const [selectedReview, setSelectedReview] = useState<AccomodationReview | null>(null);
  const isEdit = !!selectedReview;

  const { result, setResult } = useReviewsResult();

  const { reviewsPage, isLoading: areReviewsLoading } = useAccomodationReviews(
    {
      guestId,
      page,
      search: finalSearch,
    },
    [result]
  );

  const loadMore = useCallback(() => setPage((page) => page + 1), [setPage]);

  useEffect(() => {
    debouncedCb(() => setFinalSearch(search));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    if (!result) return;

    if (
      result.status === ResultStatus.Ok &&
      ["REVIEW_ACCOMMODATION", "UPDATE_ACCOMMODATION_REVIEW"].includes(result.type)
    ) {
      setModalVisibility(false);
    }

    setResult(undefined);
  }, [result, setResult]);

  if (areReviewsLoading || !reviewsPage) return <></>;

  return (
    <>
      <div className="mt-10 space-y-5">
        <Modal
          title="Review"
          isOpen={isModalVisisble}
          isLarge={true}
          onClose={() => setModalVisibility(false)}
        >
          <AccommodationsReviewForm isEdit={isEdit} existingReview={selectedReview} />
        </Modal>

        <div className="pl-7">
          <div className="flex space-x-5 items-end">
            <div className="flex-grow">
              <InputField
                label="Search"
                formElement={{
                  value: search,
                  onChange: (e: any) => setSearch(e.target.value),
                }}
              />
            </div>

            <UserSpecific userId={guestId}>
              <div>
                <Button
                  type="button"
                  onClick={() => {
                    setSelectedReview(null);
                    setModalVisibility(true);
                  }}
                >
                  Review
                </Button>
              </div>
            </UserSpecific>
          </div>
        </div>

        <GuestAccommodationReviewsPage
          reviewsPage={reviewsPage}
          onEdit={(review: AccomodationReview) => {
            setSelectedReview(review);
            setModalVisibility(true);
          }}
          onLoadMore={loadMore}
        />
      </div>
    </>
  );
};
