import { useQuery } from "react-query";
import { type User } from "./UserModels";
import axios from "axios";
import { createEntitiesMap } from "../../core/utils/map";

export function useUsersMap(userIds: User["id"][], dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [userIds, ...dependencies],
    () =>
      axios.get(
        `/userService/api/users?${userIds?.map((userId) => "userIds=" + userId).join("&")}`
      ),
    {
      enabled:
        dependencies?.reduce((acc, dep) => acc && !dep, true) && !!userIds && !!userIds.length,
    }
  );

  return {
    usersMap: createEntitiesMap(data?.data ?? []) as { [key: string]: User },
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
