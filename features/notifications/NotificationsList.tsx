import { type FC } from "react";
import type { TNotification } from "./NotificationsModels";
import { NotificationListItem } from "./NotificationListItem";
import { useNotifications as useNotificationsService } from "../../core/hooks/useNotifications";
import { useAction } from "../../core/hooks/useAction";
import { deleteNotification, seenNotification, unseenNotification } from "./notificationActions";
import { extractErrorMessage } from "../../core/utils/errors";
import { useNotificationsResult } from "./useNotificationsResult";
import { ResultStatus } from "../../core/contexts/Result";

type NotificationsListProps = {
  notifications: TNotification[];
};

export const NotificationsList: FC<NotificationsListProps> = ({ notifications }) => {
  const notificationsService = useNotificationsService();
  const { setResult } = useNotificationsResult();

  const seenNotificationAction = useAction<TNotification>(seenNotification, {
    onSuccess: () => {
      notificationsService.success("You have successfully seen notification.");
      setResult({ status: ResultStatus.Ok, type: "SEEN_NOTIFICATION" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "SEEN_NOTIFICATION" });
    },
  });

  const unseenNotificationAction = useAction<TNotification>(unseenNotification, {
    onSuccess: () => {
      notificationsService.success("You have successfully unseen notification.");
      setResult({ status: ResultStatus.Ok, type: "UNEEN_NOTIFICATION" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "UNEEN_NOTIFICATION" });
    },
  });

  const deleteNotificationAction = useAction<TNotification>(deleteNotification, {
    onSuccess: () => {
      notificationsService.success("You have successfully deleted notification.");
      setResult({ status: ResultStatus.Ok, type: "DELETE_NOTIFICATION" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "DELETE_NOTIFICATION" });
    },
  });

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {notifications?.map((notification: TNotification) => (
        <NotificationListItem
          key={notification.id}
          notification={notification}
          onSeenClick={() => seenNotificationAction(notification)}
          onUnseenClick={() => unseenNotificationAction(notification)}
          onDeleteClick={() => deleteNotificationAction(notification)}
        />
      ))}
    </ul>
  );
};
