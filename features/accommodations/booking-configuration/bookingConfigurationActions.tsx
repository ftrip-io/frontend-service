import axios from "axios";

type UpdateAccommodationBookingConfiguration = {
  isManualAccept: boolean;
};

function updateBookingConfigurationFor(accommodationId: string) {
  return (bookingConfiguration: UpdateAccommodationBookingConfiguration) =>
    axios.put(`/bookingService/api/accommodations/${accommodationId}`, bookingConfiguration);
}

export { updateBookingConfigurationFor };

export type { UpdateAccommodationBookingConfiguration };
