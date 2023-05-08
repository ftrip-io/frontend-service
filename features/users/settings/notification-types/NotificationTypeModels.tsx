type NotificationType = {
  code: string;
  description: string;
  group: string;
  allowedUserTypes: string[];
};

type UserNotificationType = {
  userId: string;
  code: string;
};

export type { NotificationType, UserNotificationType };
