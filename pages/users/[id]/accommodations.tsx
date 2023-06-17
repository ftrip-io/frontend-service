import { useRouter } from "next/router";
import { useUser } from "../../../features/users/useUsers";
import { UserType } from "../../../features/users/UserModels";
import { HostsAccommodations } from "../../../features/accommodations/preview/HostsAccommodations";

const HostsAccommodationsPage = () => {
  const router = useRouter();

  const userId = router?.query.id?.toString() ?? "";
  const { user } = useUser(userId);

  if (!userId || !user) return <></>;

  return (
    <div className="mx-10">
      {user.type === UserType.Guest ? "Not a host" : <HostsAccommodations hostId={userId} />}
    </div>
  );
};

export default HostsAccommodationsPage;
