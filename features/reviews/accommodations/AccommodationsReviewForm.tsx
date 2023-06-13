import { type FC, useEffect, useMemo } from "react";
import { useNotifications } from "../../../core/hooks/useNotifications";
import { useReviewsResult } from "../useReviewsResult";
import { useZodValidatedFrom } from "../../../core/hooks/useZodValidatedForm";
import {
  type ReviewAccommodation,
  reviewAccommodationScheme,
  reviewAccommodationAs,
  updateAccommodationReview,
} from "./accommodationReviewActions";
import { Button } from "../../../core/components/Button";
import { AreaField } from "../../../core/components/AreaField";
import { Rating } from "../../../core/components/Rating";
import { useAction } from "../../../core/hooks/useAction";
import { useAuthContext } from "../../../core/contexts/Auth";
import { ResultStatus } from "../../../core/contexts/Result";
import { extractErrorMessage } from "../../../core/utils/errors";
import { usePossibleAccommodationsForReview } from "./usePossibleAccommodationsForReview";
import { SelectOptionField } from "../../../core/components/SelectOptionField";
import { type AccomodationReview } from "./AccommodationReviewModels";

type AccommodationsReviewFormProps = {
  isEdit?: boolean;
  existingReview: AccomodationReview | null;
};

export const AccommodationsReviewForm: FC<AccommodationsReviewFormProps> = ({
  isEdit,
  existingReview,
}) => {
  const notifications = useNotifications();
  const { result, setResult } = useReviewsResult();

  const guestId = useAuthContext().user?.id ?? "";
  const { accommodations } = usePossibleAccommodationsForReview(guestId, [result]);
  const accommodationOptions = useMemo(() => {
    return accommodations?.map((accommodation: string) => ({
      label: accommodation,
      value: accommodation,
    }));
  }, [accommodations]);

  const {
    register: reviewForm,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useZodValidatedFrom<ReviewAccommodation>(reviewAccommodationScheme);

  const accommodationId = watch("accommodationId");
  const accomodationGrade = watch("accomodationGrade");
  const locationGrade = watch("locationGrade");
  const valueForMoneyGrade = watch("valueForMoneyGrade");

  const reviewAction = useAction<ReviewAccommodation>(reviewAccommodationAs(guestId), {
    onSuccess: () => {
      notifications.success("You have successfully review accommodation.");
      setResult({ status: ResultStatus.Ok, type: "REVIEW_ACCOMMODATION" });
    },
    onError: (error: any) => {
      notifications.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "REVIEW_ACCOMMODATION" });
    },
  });

  const updateReviewAction = useAction<ReviewAccommodation>(
    updateAccommodationReview(existingReview?.id ?? ""),
    {
      onSuccess: () => {
        notifications.success("You have successfully updated review for accommodation.");
        setResult({ status: ResultStatus.Ok, type: "UPDATE_ACCOMMODATION_REVIEW" });
      },
      onError: (error: any) => {
        notifications.error(extractErrorMessage(error));
        setResult({ status: ResultStatus.Error, type: "UPDATE_ACCOMMODATION_REVIEW" });
      },
    }
  );

  useEffect(() => {
    if (!existingReview) {
      reset(undefined);
      return;
    }

    reset({
      accommodationId: existingReview?.accomodationId,
      accomodationGrade: existingReview?.grades.accomodation,
      locationGrade: existingReview?.grades.location,
      valueForMoneyGrade: existingReview?.grades.valueForMoney,
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
                  label="Accommodation"
                  onChange={(value) => setValue("accommodationId", value)}
                  errorMessage={errors.accommodationId?.message}
                  value={accommodationId}
                  options={accommodationOptions}
                />
              </div>
            ) : (
              <></>
            )}

            <div className="col-span-4 min-w-full">
              <div className="flex flex-col items-center">
                <Rating
                  label="Accommodation"
                  value={accomodationGrade}
                  onChange={(newValue: number) =>
                    !!newValue && setValue("accomodationGrade", newValue)
                  }
                />
              </div>
            </div>

            <div className="col-span-4">
              <div className="flex flex-col items-center">
                <Rating
                  label="Location"
                  value={locationGrade}
                  onChange={(newValue: number) => !!newValue && setValue("locationGrade", newValue)}
                />
              </div>
            </div>

            <div className="col-span-4">
              <div className="flex flex-col items-center">
                <Rating
                  label="Value For Money"
                  value={valueForMoneyGrade}
                  onChange={(newValue: number) =>
                    !!newValue && setValue("valueForMoneyGrade", newValue)
                  }
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
