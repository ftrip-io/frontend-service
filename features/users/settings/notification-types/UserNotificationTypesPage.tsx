import { type FC } from "react";
import type { UserSpecificProfilePageProps } from "../../../../types";
import { UserNotificationTypesForm } from "./UserNotificationTypesForm";

type NotificationsPageProps = UserSpecificProfilePageProps & {};

export const UserNotificationTypesPage: FC<NotificationsPageProps> = ({ userId }) => {
  return (
    <>
      <UserNotificationTypesForm userId={userId} />
    </>
  );
};
