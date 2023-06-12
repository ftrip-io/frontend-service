import { useRouter } from "next/router";
import { useUser } from "../../../features/users/useUsers";
import { UserType } from "../../../features/users/UserModels";
import { GuestReservations } from "../../../features/reservations/GuestReservations";
import { HostReservations } from "../../../features/reservations/HostReservations";

const Reservations = () => {
  const router = useRouter();

  const userId = router?.query.id?.toString() ?? "";
  const { user } = useUser(userId);

  if (!userId || !user) return <></>;

  return (
    <div className="mx-10">
      {user.type === UserType.Guest ? (
        <GuestReservations guestId={userId} />
      ) : (
        <HostReservations hostId={userId} />
      )}
    </div>
  );
};

export default Reservations;
