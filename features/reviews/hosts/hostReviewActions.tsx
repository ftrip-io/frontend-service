import axios from "axios";
import * as z from "zod";

const reviewHostScheme = z.object({
  hostId: z.string().min(1, "Host must be provided."),
  communicationGrade: z.number().min(1).max(5).default(1),
  overallGrade: z.number().min(1).max(5).default(1),
  recensionText: z.string().min(10, "You have to write at least 10 charaters"),
});

type ReviewHost = z.infer<typeof reviewHostScheme>;

function reviewHostAs(guestId: string) {
  return (review: ReviewHost) => {
    return axios.post("/bookingService/api/hosts/reviews", {
      ...review,
      guestId,
    });
  };
}

function updateHostReview(reviewId: string) {
  return (review: ReviewHost) => {
    return axios.put(`/bookingService/api/hosts/reviews/${reviewId}`, {
      ...review,
    });
  };
}

function deleteHostReview(reviewId: string) {
  return axios.delete(`/bookingService/api/hosts/reviews/${reviewId}`);
}

export { reviewHostScheme, reviewHostAs, updateHostReview, deleteHostReview };

export type { ReviewHost };
