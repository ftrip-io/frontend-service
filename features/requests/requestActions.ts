import axios from "axios";
import type { CreateReservationRequest } from "./ReservationRequestsModels";
import moment from "moment";

function createReservationRequest(request: CreateReservationRequest) {
  request.datePeriod.dateFrom = moment(request.datePeriod.dateFrom).startOf("day").format() as any;
  request.datePeriod.dateTo = moment(request.datePeriod.dateTo).startOf("day").format() as any;

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
