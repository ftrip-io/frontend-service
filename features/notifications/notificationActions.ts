import axios from "axios";
import type { TNotification } from "./NotificationsModels";

function seenNotification({ id: notificationId, userId }: TNotification) {
  return axios.put(`/notificationService/api/users/${userId}/notifications/${notificationId}/seen`);
}

function unseenNotification({ id: notificationId, userId }: TNotification) {
  return axios.put(
    `/notificationService/api/users/${userId}/notifications/${notificationId}/unseen`
  );
}

function deleteNotification({ id: notificationId, userId }: TNotification) {
  return axios.delete(`/notificationService/api/users/${userId}/notifications/${notificationId}`);
}

export { seenNotification, unseenNotification, deleteNotification };
