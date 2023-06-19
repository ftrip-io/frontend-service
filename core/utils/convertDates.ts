import moment from "moment";
import { type DatePeriod } from "../../types";

export function convertDatesInResponse<T extends { datePeriod: DatePeriod }>(objects: T[]) {
  if (!objects) return objects;

  for (const o of objects) {
    if (typeof o.datePeriod.dateFrom === "string")
      o.datePeriod.dateFrom = moment(o.datePeriod.dateFrom).startOf("day").toDate();
    if (typeof o.datePeriod.dateTo === "string")
      o.datePeriod.dateTo = moment(o.datePeriod.dateTo).endOf("day").toDate();
  }
  objects.sort((a1, a2) => a1.datePeriod.dateFrom.getTime() - a2.datePeriod.dateTo.getTime());
  return objects;
}
