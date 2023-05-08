import { useQuery } from "react-query";
import axios from "axios";
import type { NotificationType } from "./NotificationTypeModels";

export function useNotificationTypes(userType: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    ["notification-types", userType, ...dependencies],
    () => axios.get(`/notificationService/api/notification-types?userType=${userType}`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true),
    }
  );

  return {
    notificationTypes: data?.data as NotificationType[],
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
