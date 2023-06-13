import { useRouter } from "next/router";
import { GuestHostReviews } from "../../../../features/reviews/hosts/GuestHostReviews";

const HostReviews = () => {
  const router = useRouter();

  const userId = router?.query.id?.toString() ?? "";

  if (!userId) return <></>;

  return (
    <>
      <GuestHostReviews guestId={userId} />
    </>
  );
};

export default HostReviews;
