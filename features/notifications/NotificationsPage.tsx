import { type FC, useCallback, useEffect, useState } from "react";
import type { UserSpecificProfilePageProps } from "../../types";
import { useTNotifications } from "./useNotifications";
import { NotificationsList } from "./NotificationsList";
import { useNotificationsResult } from "./useNotificationsResult";
import { NotificationsFilter } from "./NotificationsFilter";
import { useRouter } from "next/router";
import { addQueryParam } from "../../core/utils/router";

type NotificationsPageProps = UserSpecificProfilePageProps & {};

export const NotificationsPage: FC<NotificationsPageProps> = ({ userId }) => {
  const router = useRouter();
  const { result, setResult } = useNotificationsResult();

  const [seen, setSeen] = useState(router.query?.seen?.toString() ?? "false");
  const { notifications } = useTNotifications(userId, seen, [result]);

  const onSeenChange = useCallback(
    (newSeen: string) => {
      setSeen(newSeen);
      addQueryParam(router, { seen: newSeen });
    },
    [router]
  );

  useEffect(() => {
    if (!result) return;

    setResult(undefined);
  }, [result, setResult]);

  return (
    <>
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <NotificationsFilter seen={seen} onSeenChange={onSeenChange} />
        </div>
      </div>
      <NotificationsList notifications={notifications} />
    </>
  );
};
