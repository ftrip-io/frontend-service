import { type FC, useEffect, useState } from "react";
import { useReservationRequestsByGuest } from "./useReservationRequests";
import { useRequestsResult } from "./useRequestsResult";
import moment from "moment";
import { useAccommodationsMap } from "../accommodations/useAccommodationsMap";
import Link from "next/link";
import { UserSpecific } from "../../core/components/UserSpecific";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { ReservationRequestStatus, type ReservationRequest } from "./ReservationRequestsModels";
import { useAction } from "../../core/hooks/useAction";
import { deleteReservationRequest } from "./requestActions";
import { useNotifications } from "../../core/hooks/useNotifications";
import { ResultStatus } from "../../core/contexts/Result";
import { extractErrorMessage } from "../../core/utils/errors";
import { ReservationRequestsSearchForm } from "./ReservationRequestsSearchForm";
import { statusToText } from "./utils";

const ReservationRequestRow: FC<{
  reservationRequest: ReservationRequest;
  onDeleteClick: () => any;
}> = ({ reservationRequest, onDeleteClick }) => {
  return (
    <>
      <li className="mb-10">
        <div className="py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex min-w-full">
            <div className="flex-grow space-y-2">
              <p>
                Reservation requesting{" "}
                <Link href={`/accommodations/${reservationRequest.accomodationId}`}>
                  <span>{reservationRequest.accommodation}</span>
                </Link>{" "}
                for {reservationRequest.guestNumber}{" "}
                {reservationRequest.guestNumber === 1 ? "guest" : "guests"} from{" "}
                {new Date(reservationRequest.datePeriod.dateFrom).toDateString()} to{" "}
                {new Date(reservationRequest.datePeriod.dateTo).toDateString()} (
                {statusToText(reservationRequest.status)})
              </p>

              <p className="text-sm text-gray-700">
                requested {moment(reservationRequest.createdAt).fromNow()}
              </p>
            </div>

            {reservationRequest.status === ReservationRequestStatus.Waiting ? (
              <UserSpecific userId={reservationRequest.guestId}>
                <div className="space-x-2 justify-end">
                  <XCircleIcon className="inline-block h-5 w-5" onClick={onDeleteClick} />
                </div>
              </UserSpecific>
            ) : (
              <></>
            )}
          </div>
        </div>
      </li>
    </>
  );
};

const ReservationRequestsPage: FC<{ reservationRequests: ReservationRequest[] }> = ({
  reservationRequests,
}) => {
  const notificationsService = useNotifications();
  const { setResult } = useRequestsResult();

  const accommodationIds =
    reservationRequests?.map((reservationRequest) => reservationRequest.accomodationId) ?? [];

  const { accommodationsMap } = useAccommodationsMap(accommodationIds);

  const deleteRequestAction = useAction<string>(deleteReservationRequest, {
    onSuccess: () => {
      notificationsService.success("You have successfully deleted reservation request.");
      setResult({ status: ResultStatus.Ok, type: "DELETE_RESERVATION_REQUEST" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "DELETE_RESERVATION_REQUEST" });
    },
  });

  return (
    <>
      <ol>
        {reservationRequests.map((reservationRequest: ReservationRequest, i: number) => {
          const accommodation = accommodationsMap[reservationRequest.accomodationId];
          reservationRequest.accommodation = accommodation?.title;

          return (
            <ReservationRequestRow
              reservationRequest={reservationRequest}
              onDeleteClick={() => deleteRequestAction(reservationRequest.id)}
              key={i}
            />
          );
        })}
      </ol>
    </>
  );
};

type GuestReservationRequestsProps = {
  guestId: string;
};

export const GuestReservationRequests: FC<GuestReservationRequestsProps> = ({ guestId }) => {
  const [filters, setFilters] = useState<any>({ status: "" });
  const { result, setResult } = useRequestsResult();
  const { reservationRequests, isLoading } = useReservationRequestsByGuest(guestId, filters, [
    result,
  ]);

  useEffect(() => {
    if (!result) return;

    setResult(undefined);
  }, [result, setResult]);

  if (isLoading || !reservationRequests) return <></>;

  return (
    <>
      <div className="mt-10 space-y-5">
        <ReservationRequestsSearchForm initialFilters={filters} onFiltersChange={setFilters} />
        <ReservationRequestsPage reservationRequests={reservationRequests} />
      </div>
    </>
  );
};
