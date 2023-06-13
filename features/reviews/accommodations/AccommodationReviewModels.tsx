type AccomodationReview = {
  id: string;
  guestId: string;
  guest?: string;
  accomodationId: string;
  accommodation: string;
  grades: AccommodationGrades;
  recension: AccommodationRecension;
  createdAt: string;
};

type AccommodationGrades = {
  accomodation: number;
  location: number;
  valueForMoney: number;
  average: number;
};

type AccommodationRecension = {
  text: string;
};

type AccomodationReviewsSummary = {
  accomodationId: string;
  reviewsCount: number;
  grades: AccomodationGradesSummary;
};

type AccomodationGradesSummary = AccommodationGrades & {};

export type {
  AccomodationReview,
  AccommodationGrades,
  AccommodationRecension,
  AccomodationReviewsSummary,
  AccomodationGradesSummary,
};
