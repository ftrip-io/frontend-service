import axios from "axios";

type ConfiguredNotificationTypes = {
  codes: string[];
};

function configureNotificationTypesForUser(userId: string) {
  return (notifications: ConfiguredNotificationTypes) => {
    return axios.put(`/notificationService/api/users/${userId}/notification-types`, notifications);
  };
}

export { configureNotificationTypesForUser };
export type { ConfiguredNotificationTypes };
