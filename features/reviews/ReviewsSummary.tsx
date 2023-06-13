import { type FC } from "react";
import { Star } from "./Star";

type ReviewsSummaryProps = {
  reviewsCount: number;
  averageGrade: number;
};

export const ReviewsSummary: FC<ReviewsSummaryProps> = ({ reviewsCount, averageGrade }) => {
  if (!reviewsCount) return <>(Not graded yet)</>;

  return (
    <div className="flex items-center space-x-1">
      <Star />
      <p className="text-sm">
        {averageGrade.toPrecision(3)} ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
      </p>
    </div>
  );
};
