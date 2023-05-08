import { useQuery } from "react-query";
import axios from "axios";
import type { UserNotificationType } from "./NotificationTypeModels";
import type { User } from "../../UserModels";

export function useUserNotificationTypes(userId: User["id"], dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`users/${userId}/user-notification-types`, ...dependencies],
    () => axios.get(`/notificationService/api/users/${userId}/notification-types`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!userId,
    }
  );

  return {
    userNotificationTypes: data?.data as UserNotificationType[],
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
