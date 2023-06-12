import axios from "axios";

function cancelReservation(reservationId: string) {
  return axios.put(`/bookingService/api/reservations/${reservationId}`);
}

export { cancelReservation };
