import { useQuery } from "react-query";
import { User } from "./UserModels";
import axios from "axios";

export function useUser(userId: User["id"], dependencies: any[] = []) {
  const { data, isFetching, error } = useQuery(
    [userId, ...dependencies],
    () => axios.get(`/userService/api/users/${userId}`),
    {
      enabled: dependencies?.reduce((acc, dep) => acc && !dep, true) && !!userId,
    }
  );

  return {
    user: data?.data as User,
    isLoading: isFetching,
    error: (error as any)?.response?.data,
  };
}
