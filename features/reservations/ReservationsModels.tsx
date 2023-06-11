import { type DatePeriod } from "../../types";

type Reservation = {
  id: string;
  guestId: string;
  guest?: string;
  accomodationId: string;
  accommodation?: string;
  datePeriod: DatePeriod;
  guestNumber: number;
  isCancelled: boolean;
  createdAt: string;
};

export type { Reservation };
