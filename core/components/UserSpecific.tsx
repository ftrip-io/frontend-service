import { type FC } from "react";
import { type AuthUser, useAuthContext } from "../contexts/Auth";

type UserSpecificProps = {
  userId: string;
  children: React.ReactNode;
};

export const UserSpecific: FC<UserSpecificProps> = ({ children, userId = undefined }) => {
  const authenticatedUserId = (useAuthContext()?.user as AuthUser)?.id;

  return authenticatedUserId === userId ? <>{children}</> : <></>;
};
