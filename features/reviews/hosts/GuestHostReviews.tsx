import { type FC, useCallback, useEffect, useState } from "react";
import { Star } from "../Star";
import Link from "next/link";
import moment from "moment";
import { PencilIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { PageResult } from "../../../types";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { useReviewsResult } from "../useReviewsResult";
import { deleteHostReview } from "./hostReviewActions";
import { useAction } from "../../../core/hooks/useAction";
import { ResultStatus } from "../../../core/contexts/Result";
import { extractErrorMessage } from "../../../core/utils/errors";
import { Button } from "../../../core/components/Button";
import debounce from "lodash.debounce";
import { InputField } from "../../../core/components/InputField";
import { useHostReviews } from "./useHostReviews";
import { Modal } from "../../../core/components/Modal";
import { HostsReviewForm } from "./HostsReviewForm";
import { UserSpecific } from "../../../core/components/UserSpecific";
import { useUsersMap } from "../../users/useUsersMap";
import { type HostReview } from "./HostReviewModels";

type GuestHostReviewProps = {
  review: HostReview;
  onEditClick: () => any;
  onDeleteClick: () => any;
};

const GuestHostReview: FC<GuestHostReviewProps> = ({ review, onEditClick, onDeleteClick }) => {
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
                <Link href={`/users/${review.hostId}`}>to {review.host}</Link>
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

const GuestHostReviewsPage: FC<{
  reviewsPage: PageResult<HostReview>;
  onEdit: (review: HostReview) => any;
  onLoadMore: any;
}> = ({ reviewsPage, onEdit, onLoadMore }) => {
  const { entities: reviews, totalEntities } = reviewsPage || {};
  const hostIds = reviews?.map((review) => review.hostId) ?? [];

  const { usersMap: hostsMap } = useUsersMap(hostIds);

  const notificationsService = useNotifications();
  const { setResult } = useReviewsResult();

  const deleteReviewAction = useAction<string>(deleteHostReview, {
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
        {reviews.map((review: HostReview, i: number) => {
          const host = hostsMap[review.hostId];
          review.host = `${host?.firstName} ${host?.lastName}`;

          return (
            <GuestHostReview
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

type GuestHostReviewsProps = {
  guestId: string;
};

export const GuestHostReviews: FC<GuestHostReviewsProps> = ({ guestId }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [finalSearch, setFinalSearch] = useState(search);
  const [isModalVisisble, setModalVisibility] = useState(false);
  const [selectedReview, setSelectedReview] = useState<HostReview | null>(null);
  const isEdit = !!selectedReview;

  const { result, setResult } = useReviewsResult();

  const { reviewsPage, isLoading: areReviewsLoading } = useHostReviews(
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
      ["REVIEW_HOST", "UPDATE_HOST_REVIEW"].includes(result.type)
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
          <HostsReviewForm isEdit={isEdit} existingReview={selectedReview} />
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

        <GuestHostReviewsPage
          reviewsPage={reviewsPage}
          onEdit={(review: HostReview) => {
            setSelectedReview(review);
            setModalVisibility(true);
          }}
          onLoadMore={loadMore}
        />
      </div>
    </>
  );
};
