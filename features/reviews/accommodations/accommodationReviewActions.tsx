import axios from "axios";
import * as z from "zod";

const reviewAccommodationScheme = z.object({
  accommodationId: z.string().min(1, "Accommodation must be provided."),
  accomodationGrade: z.number().min(1).max(5).default(1),
  locationGrade: z.number().min(1).max(5).default(1),
  valueForMoneyGrade: z.number().min(1).max(5).default(1),
  recensionText: z.string().min(10, "You have to write at least 10 charaters."),
});

type ReviewAccommodation = z.infer<typeof reviewAccommodationScheme>;

function reviewAccommodationAs(guestId: string) {
  return (review: ReviewAccommodation) => {
    return axios.post("/bookingService/api/accommodations/reviews", {
      ...review,
      accomodationId: review.accommodationId,
      guestId,
    });
  };
}

function updateAccommodationReview(reviewId: string) {
  return (review: ReviewAccommodation) => {
    return axios.put(`/bookingService/api/accommodations/reviews/${reviewId}`, {
      ...review,
    });
  };
}

function deleteAccommodationReview(reviewId: string) {
  return axios.delete(`/bookingService/api/accommodations/reviews/${reviewId}`);
}

export {
  reviewAccommodationScheme,
  reviewAccommodationAs,
  updateAccommodationReview,
  deleteAccommodationReview,
};

export type { ReviewAccommodation };
