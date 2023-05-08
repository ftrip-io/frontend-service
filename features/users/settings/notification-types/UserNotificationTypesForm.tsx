import { type FC, useEffect, useMemo } from "react";
import { Button } from "../../../../core/components/Button";
import { useAction } from "../../../../core/hooks/useAction";
import { useNotifications } from "../../../../core/hooks/useNotifications";
import { useZodValidatedFrom } from "../../../../core/hooks/useZodValidatedForm";
import { useNotificationTypes } from "./useNotificationTypes";
import { getTypeFromToken } from "../../../../core/utils/token";
import { useUserNotificationTypes } from "./useUserNotificationTypes";
import { z } from "zod";
import type { NotificationType, UserNotificationType } from "./NotificationTypeModels";
import { Checkbox } from "../../../../core/components/Checkbox";
import {
  type ConfiguredNotificationTypes,
  configureNotificationTypesForUser,
} from "./configureNotificationTypes";
import { extractErrorMessage } from "../../../../core/utils/errors";
import { useQueryClient } from "react-query";
import { groupBy } from "../../../../core/utils/grouping";

type NotificationsFormProps = {
  userId: string;
};

function computeNotificationTypesSchema(notificationTypes: NotificationType[]) {
  return z.object(
    notificationTypes?.reduce((schema: any, notificationType: NotificationType) => {
      schema[notificationType.code] = z.boolean();
      return schema;
    }, {})
  );
}

function selectedNotificationTypesToRequest(notificationTypes: any): ConfiguredNotificationTypes {
  return {
    codes: Object.keys(notificationTypes).filter(
      (notificationType) => notificationTypes[notificationType]
    ),
  };
}

function configuredNotificationTypesToFormDefaultValues(
  userNotificationTypes: UserNotificationType[]
): any {
  return userNotificationTypes?.reduce(
    (defaultValues: any, userNotificationType: UserNotificationType) => {
      defaultValues[userNotificationType.code] = true;
      return defaultValues;
    },
    {}
  );
}

const NotificationTypesGroup = ({ groupName, notificationTypes, notificationTypesForm }: any) => {
  return (
    <>
      <p className="my-2 text-xl font-bold">{groupName}</p>
      {notificationTypes?.map((notificationType: NotificationType) => {
        return (
          <Checkbox
            key={notificationType.code}
            label={notificationType.description}
            formElement={notificationTypesForm(notificationType.code)}
          />
        );
      }) ?? <></>}
    </>
  );
};

export const UserNotificationTypesForm: FC<NotificationsFormProps> = ({ userId }) => {
  const queryClient = useQueryClient();
  const notifications = useNotifications();

  const { notificationTypes } = useNotificationTypes(getTypeFromToken());
  const { userNotificationTypes } = useUserNotificationTypes(userId);
  const notificationTypesSchema = computeNotificationTypesSchema(notificationTypes);
  type NotificationTypes = z.infer<typeof notificationTypesSchema>;

  const {
    register: notificationTypesForm,
    handleSubmit,
    reset,
  } = useZodValidatedFrom<NotificationTypes>(
    notificationTypesSchema,
    configuredNotificationTypesToFormDefaultValues(userNotificationTypes)
  );

  const configureNotificationTypesAction = useAction<ConfiguredNotificationTypes>(
    configureNotificationTypesForUser(userId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: `users/${userId}/user-notification-types` });
        notifications.success("You have successfully configured notifications.");
      },
      onError: (error: any) => {
        notifications.error(extractErrorMessage(error));
      },
    }
  );

  useEffect(() => {
    reset(configuredNotificationTypesToFormDefaultValues(userNotificationTypes));
  }, [reset, userNotificationTypes]);

  const groupedNotificationTypes = useMemo(() => {
    return groupBy<NotificationType>(notificationTypes, "group");
  }, [notificationTypes]);

  return (
    <>
      <form
        onSubmit={handleSubmit((notificationTypes: any) => {
          configureNotificationTypesAction(selectedNotificationTypesToRequest(notificationTypes));
        })}
      >
        <div className="overflow-hidden shadow sm:rounded-md">
          <div className="bg-white px-4 py-5 sm:p-6">
            {Object.entries(groupedNotificationTypes).map(([groupedBy, notificationTypes]) => (
              <NotificationTypesGroup
                key={groupedBy}
                groupName={groupedBy}
                notificationTypes={notificationTypes}
                notificationTypesForm={notificationTypesForm}
              />
            ))}
          </div>

          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <Button>Configure</Button>
          </div>
        </div>
      </form>
    </>
  );
};
