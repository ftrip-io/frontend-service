import { useQuery } from "react-query";
import type { User } from "../users/UserModels";
import axios from "axios";
import type { TNotification } from "./NotificationsModels";

export function useNotifications(userId: User["id"], seen: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [userId, seen, ...dependencies],
    () =>
      axios.get(
        `/notificationService/api/users/${userId}/notifications${
          seen === "All" ? `` : `?seen=${seen}`
        }`
      ),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!userId,
    }
  );

  return {
    notifications: data?.data as TNotification[],
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
