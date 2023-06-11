import axios from "axios";
import type { CreateReservationRequest } from "./ReservationRequestsModels";

function createReservationRequest(request: CreateReservationRequest) {
  return axios.post(`/bookingService/api/reservation-requests`, request);
}

function acceptReservationRequest(requestId: string) {
  return axios.put(`/bookingService/api/reservation-requests/${requestId}/accept`);
}

function declineReservationRequest(requestId: string) {
  return axios.put(`/bookingService/api/reservation-requests/${requestId}/decline`);
}

function deleteReservationRequest(requestId: string) {
  return axios.delete(`/bookingService/api/reservation-requests/${requestId}`);
}

export {
  createReservationRequest,
  acceptReservationRequest,
  declineReservationRequest,
  deleteReservationRequest,
};
