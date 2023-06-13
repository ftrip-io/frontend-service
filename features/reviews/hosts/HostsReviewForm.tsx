import { type FC, useEffect, useMemo } from "react";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { useReviewsResult } from "../useReviewsResult";
import { useZodValidatedFrom } from "../../../core/hooks/useZodValidatedForm";
import { Button } from "../../../core/components/Button";
import { AreaField } from "../../../core/components/AreaField";
import { Rating } from "../../../core/components/Rating";
import { useAction } from "../../../core/hooks/useAction";
import { useAuthContext } from "../../../core/contexts/Auth";
import { ResultStatus } from "../../../core/contexts/Result";
import { extractErrorMessage } from "../../../core/utils/errors";
import { ReviewHost, reviewHostAs, reviewHostScheme, updateHostReview } from "./hostReviewActions";
import { usePossibleHostsForReview } from "./usePossibleHostsForReview";
import { SelectOptionField } from "../../../core/components/SelectOptionField";
import { type HostReview } from "./HostReviewModels";

type HostsReviewFormProps = {
  isEdit?: boolean;
  existingReview: HostReview | null;
};

export const HostsReviewForm: FC<HostsReviewFormProps> = ({ isEdit, existingReview }) => {
  const notifications = useNotifications();
  const { result, setResult } = useReviewsResult();

  const guestId = useAuthContext().user?.id ?? "";
  const { hosts } = usePossibleHostsForReview(guestId, [result]);
  const hostOptions = useMemo(() => {
    return hosts?.map((host: string) => ({
      label: host,
      value: host,
    }));
  }, [hosts]);

  const {
    register: reviewForm,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useZodValidatedFrom<ReviewHost>(reviewHostScheme);

  const hostId = watch("hostId");
  const communicationGrade = watch("communicationGrade");
  const overallGrade = watch("overallGrade");

  const reviewAction = useAction<ReviewHost>(reviewHostAs(guestId), {
    onSuccess: () => {
      notifications.success("You have successfully review host.");
      setResult({ status: ResultStatus.Ok, type: "REVIEW_HOST" });
    },
    onError: (error: any) => {
      notifications.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "REVIEW_HOST" });
    },
  });

  const updateReviewAction = useAction<ReviewHost>(updateHostReview(existingReview?.id ?? ""), {
    onSuccess: () => {
      notifications.success("You have successfully updated review for host.");
      setResult({ status: ResultStatus.Ok, type: "UPDATE_HOST_REVIEW" });
    },
    onError: (error: any) => {
      notifications.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "UPDATE_HOST_REVIEW" });
    },
  });

  useEffect(() => {
    if (!existingReview) {
      reset(undefined);
      return;
    }

    reset({
      hostId: existingReview?.hostId,
      communicationGrade: existingReview?.grades.communication,
      overallGrade: existingReview?.grades.overall,
      recensionText: existingReview.recension.text,
    });
  }, [reset, existingReview]);

  return (
    <>
      <form onSubmit={handleSubmit(!isEdit ? reviewAction : updateReviewAction)}>
        <div className="bg-white px-4 py-5 sm:p-6">
          <div className="grid grid-cols-12 gap-6">
            {!isEdit ? (
              <div className="col-span-12">
                <SelectOptionField
                  label="Host"
                  onChange={(value) => setValue("hostId", value)}
                  errorMessage={errors.hostId?.message}
                  value={hostId}
                  options={hostOptions}
                />
              </div>
            ) : (
              <></>
            )}

            <div className="col-span-6">
              <div className="flex flex-col items-center">
                <Rating
                  label="Communication"
                  value={communicationGrade}
                  onChange={(newValue: number) =>
                    !!newValue && setValue("communicationGrade", newValue)
                  }
                />
              </div>
            </div>

            <div className="col-span-6">
              <div className="flex flex-col items-center">
                <Rating
                  label="Overall"
                  value={overallGrade}
                  onChange={(newValue: number) => !!newValue && setValue("overallGrade", newValue)}
                />
              </div>
            </div>

            <div className="col-span-12">
              <AreaField
                label="Review"
                rows={7}
                formElement={reviewForm("recensionText")}
                errorMessage={errors?.recensionText?.message}
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 sm:px-6 py-2">
          <div className="col-span-6 text-center">
            <Button>Review</Button>
          </div>
        </div>
      </form>
    </>
  );
};
