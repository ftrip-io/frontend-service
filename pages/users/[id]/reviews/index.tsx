import { useRouter } from "next/router";
import { HostReviews } from "../../../../features/reviews/hosts/HostReviews";
import { useUser } from "../../../../features/users/useUsers";
import { UserType } from "../../../../features/users/UserModels";

const HostReviewsByGuests = () => {
  const router = useRouter();

  const userId = router?.query.id?.toString() ?? "";
  const { user } = useUser(userId);

  if (!userId || !user) return <></>;

  if (user.type === UserType.Guest)
    return <div className="mt-5 text-center">Choose one of reviewed categories on the left.</div>;

  return (
    <div className="mx-10">
      <HostReviews hostId={userId} />
    </div>
  );
};

export default HostReviewsByGuests;
