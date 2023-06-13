type HostReview = {
  id: string;
  guestId: string;
  guest?: string;
  hostId: string;
  host?: string;
  grades: HostGrades;
  recension: HostRecension;
  createdAt: string;
};

type HostGrades = {
  communication: number;
  overall: number;
  average: number;
};

type HostRecension = {
  text: string;
};

type HostReviewsSummary = {
  hostId: string;
  reviewsCount: number;
  grades: HostGradesSummary;
};

type HostGradesSummary = HostGrades & {};

export type { HostReview, HostGrades, HostRecension, HostReviewsSummary, HostGradesSummary };
