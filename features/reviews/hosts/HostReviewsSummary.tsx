import { type FC } from "react";
import { useHostReviewsSummary } from "./useHostReviewsSummary";
import { ReviewsSummary } from "../ReviewsSummary";

type HostReviewsSummaryProps = {
  hostId: string;
};

export const HostReviewsSummary: FC<HostReviewsSummaryProps> = ({ hostId }) => {
  const { summary, isLoading } = useHostReviewsSummary(hostId);

  if (isLoading) return <></>;

  const { reviewsCount, grades } = summary || {};

  return <ReviewsSummary reviewsCount={reviewsCount} averageGrade={grades.average} />;
};
