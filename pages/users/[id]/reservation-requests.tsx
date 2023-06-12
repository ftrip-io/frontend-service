import { useRouter } from "next/router";
import { useUser } from "../../../features/users/useUsers";
import { UserType } from "../../../features/users/UserModels";
import { GuestReservationRequests } from "../../../features/requests/GuestReservationRequests";
import { HostReservationRequests } from "../../../features/requests/HostReservationRequests";

const ReservationRequests = () => {
  const router = useRouter();

  const userId = router?.query.id?.toString() ?? "";
  const { user } = useUser(userId);

  if (!userId || !user) return <></>;

  return (
    <div className="mx-10">
      {user.type === UserType.Guest ? (
        <GuestReservationRequests guestId={userId} />
      ) : (
        <HostReservationRequests hostId={userId} />
      )}
    </div>
  );
};

export default ReservationRequests;
