import { type DatePeriod } from "../../types";

type CreateReservationRequest = {
  guestId: string;
  accomodationId: string;
  guestNumber: number;
  datePeriod: DatePeriod;
};

type ReservationRequest = {
  id: string;
  guestId: string;
  guest?: string;
  accomodationId: string;
  accommodation?: string;
  hostId?: string;
  guestNumber: number;
  datePeriod: DatePeriod;
  status: ReservationRequestStatus;
  createdAt: string;
};

enum ReservationRequestStatus {
  Waiting,
  Accepted,
  Declined,
}

export type { CreateReservationRequest, ReservationRequest };

export { ReservationRequestStatus };
