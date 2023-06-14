import { AccommodationInfo } from "../accommodations/useAccommodationsMap";
import { User } from "../users/UserModels";

export function extractReferencesFromNotificationText(text: string) {
  const referencesWithCategory =
    text
      .match(/{[^{}]*}/g)
      ?.map((part: string) => part.replace("{", "").replace("}", "").split(":"))
      .reduce((acc: any, v: any) => {
        const [category, reference] = v;
        if (!acc[category]) {
          acc[category] = [];
        }

        acc[category].push(reference);
        return acc;
      }, {}) ?? {};

  return referencesWithCategory;
}

export function replaceUserOnNotificationText(text: string, usersMap: { [key: string]: User }) {
  return Object.values(usersMap).reduce((replacedText: any, user: User) => {
    return replacedText.replace(`{User:${user.id}}`, `${user.firstName} ${user.lastName}`);
  }, text);
}

export function replaceAccommodationOnNotificationText(
  text: string,
  accommodationsMap: { [key: string]: AccommodationInfo }
) {
  return Object.values(accommodationsMap).reduce(
    (replacedText: any, accommodation: AccommodationInfo) => {
      return replacedText.replace(`{Accommodation:${accommodation.id}}`, accommodation.title);
    },
    text
  );
}
