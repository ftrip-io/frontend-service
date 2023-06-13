import { type FC } from "react";
import { useAccomodationReviewsSummary } from "./useAccomodationReviewsSummary";
import { ReviewsSummary } from "../ReviewsSummary";

type AccommodationReviewsSummaryProps = {
  accommodationId: string;
};

export const AccommodationReviewsSummary: FC<AccommodationReviewsSummaryProps> = ({
  accommodationId,
}) => {
  const { summary, isLoading } = useAccomodationReviewsSummary(accommodationId);

  if (isLoading) return <></>;

  const { reviewsCount, grades } = summary || {};

  return <ReviewsSummary reviewsCount={reviewsCount} averageGrade={grades.average} />;
};
