import { useAuthContext } from "../../core/contexts/Auth";
import { NotificationsPage } from "../../features/notifications/NotificationsPage";

const Notifications = () => {
  const { user } = useAuthContext();

  if (!user?.id) return <></>;

  return (
    <>
      <NotificationsPage userId={user?.id} />
    </>
  );
};

export default Notifications;
