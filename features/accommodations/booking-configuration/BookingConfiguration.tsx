import { type FC } from "react";
import { useBookingConfiguration } from "./useBookingConfiguration";
import { Button } from "../../../core/components/Button";
import { useNotifications } from "../../../core/hooks/useNotifications";
import {
  type UpdateAccommodationBookingConfiguration,
  updateBookingConfigurationFor,
} from "./bookingConfigurationActions";
import { extractErrorMessage } from "../../../core/utils/errors";
import { useAction } from "../../../core/hooks/useAction";
import { useAccommodationsResult } from "../useAccommodationsResult";
import { ResultStatus } from "../../../core/contexts/Result";

type BookingConfigurationProps = {
  accommodationId: string;
};

export const BookingConfiguration: FC<BookingConfigurationProps> = ({ accommodationId }) => {
  const notificationsService = useNotifications();
  const { result, setResult } = useAccommodationsResult();

  const { bookingConfiguration } = useBookingConfiguration(accommodationId, [result]);

  const updateBookingConfigurationAction = useAction<UpdateAccommodationBookingConfiguration>(
    updateBookingConfigurationFor(accommodationId),
    {
      onSuccess: () => {
        notificationsService.success("You have successfully updated booking configuration.");
        setResult({ status: ResultStatus.Ok, type: "UPDATE_BOOKING_CONFIGURATION" });
      },
      onError: (error: any) => {
        notificationsService.error(extractErrorMessage(error));
        setResult({ status: ResultStatus.Error, type: "UPDATE_BOOKING_CONFIGURATION" });
      },
    }
  );

  if (!bookingConfiguration) return <></>;

  return (
    <>
      <div className="flex items-center p-2">
        <div className="grow">
          <p className="font-medium">Automatic Accept Reservations</p>
          <p>If enabled, new reservation requests will be accepted immediately.</p>
        </div>

        <Button
          className="text-right"
          onClick={() =>
            updateBookingConfigurationAction({
              isManualAccept: !bookingConfiguration.isManualAccept,
            })
          }
        >
          {bookingConfiguration.isManualAccept ? "Disable" : "Enable"}
        </Button>
      </div>
    </>
  );
};
