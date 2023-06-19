import { useAuthContext } from "../../core/contexts/Auth";
import { UserNotificationTypesPage } from "../../features/users/settings/notification-types/UserNotificationTypesPage";

const NotificationTypes = () => {
  const { user } = useAuthContext();

  if (!user?.id) return <></>;

  return (
    <>
      <UserNotificationTypesPage userId={user?.id} />
    </>
  );
};

NotificationTypes.requireAuth = true;

export default NotificationTypes;
