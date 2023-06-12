import { ReservationRequestStatus } from "./ReservationRequestsModels";

function statusToText(status: ReservationRequestStatus) {
  const map = {
    [ReservationRequestStatus.Waiting]: "Waiting",
    [ReservationRequestStatus.Accepted]: "Accepted",
    [ReservationRequestStatus.Declined]: "Declined",
  };

  return map[status];
}

export { statusToText };
