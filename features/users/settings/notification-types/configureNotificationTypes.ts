import axios from "axios";

type ConfiguredNotificationTypes = {
  codes: string[];
};

function configureNotificationTypesForUser(userId: string) {
  return (notificationTypes: ConfiguredNotificationTypes) => {
    return axios.put(
      `/notificationService/api/users/${userId}/notification-types`,
      notificationTypes
    );
  };
}

export { configureNotificationTypesForUser };
export type { ConfiguredNotificationTypes };
