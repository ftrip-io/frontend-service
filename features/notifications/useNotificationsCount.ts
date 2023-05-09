import { useQuery } from "react-query";
import type { User } from "../users/UserModels";
import axios from "axios";

function useNotificationsCount(userId: User["id"], seen: string, dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [`notifications/${userId}/count?seen=${seen}`, ...dependencies],
    () =>
      axios.get(
        `/notificationService/api/users/${userId}/notifications/count${
          seen === "All" ? `` : `?seen=${seen}`
        }`
      ),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!userId,
    }
  );

  return {
    notificationsCount: (data?.data as number) ?? 0,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}

export { useNotificationsCount as useTNotificationsCount };
