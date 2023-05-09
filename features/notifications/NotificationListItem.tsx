import { type FC } from "react";
import type { TNotification } from "./NotificationsModels";
import moment from "moment";
import { EyeIcon, EyeSlashIcon, TrashIcon } from "@heroicons/react/24/outline";

type NotificationListItemProps = {
  notification: TNotification;
  onSeenClick: () => any;
  onUnseenClick: () => any;
  onDeleteClick: () => any;
};

const NotificationIcon = ({ isSeen }: { isSeen: boolean }) => {
  if (isSeen) return <></>;

  return (
    <div className="self-center justify-self-center flex-none rounded-full bg-blue-500/20 p-1">
      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
    </div>
  );
};

export const NotificationListItem: FC<NotificationListItemProps> = ({
  notification,
  onSeenClick,
  onUnseenClick,
  onDeleteClick,
}) => {
  return (
    <li className="flex justify-between gap-x-6 py-5 p-2 hover:bg-gray-50 hover:rounded-lg min-w-full">
      <div className="min-w-0 flex-auto max-w-[90%]">
        <p className="text-sm font-semibold leading-6 text-gray-900 break-words">
          {notification.message}
        </p>
        <p
          className={`mt-1 truncate text-xs leading-5 ${
            notification.seen ? "text-gray-500" : "text-blue-500"
          }`}
        >
          <time dateTime={notification.createdAt}>{moment(notification.createdAt).fromNow()}</time>
        </p>
      </div>
      <div className="flex gap-x-2 items-center max-w-[10%]">
        <NotificationIcon isSeen={notification.seen} />

        {notification.seen ? (
          <EyeSlashIcon className="inline-block h-5 w-5 text-gray-900" onClick={onUnseenClick} />
        ) : (
          <EyeIcon className="inline-block h-5 w-5 text-gray-900" onClick={onSeenClick} />
        )}

        <TrashIcon className="inline-block h-4 w-5 text-gray-900" onClick={onDeleteClick} />
      </div>
    </li>
  );
};
