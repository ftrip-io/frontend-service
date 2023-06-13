import { useRouter } from "next/router";
import { GuestAccommodationReviews } from "../../../../features/reviews/accommodations/GuestAccommodationReviews";

const AccommodationReviews = () => {
  const router = useRouter();

  const userId = router?.query.id?.toString() ?? "";

  if (!userId) return <></>;

  return (
    <>
      <GuestAccommodationReviews guestId={userId} />
    </>
  );
};

export default AccommodationReviews;
