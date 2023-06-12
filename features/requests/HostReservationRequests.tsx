import { type FC, useEffect, useState } from "react";
import { useReservationRequestsByAccommodation } from "./useReservationRequests";
import { useRequestsResult } from "./useRequestsResult";
import moment from "moment";
import Link from "next/link";
import { UserSpecific } from "../../core/components/UserSpecific";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { ReservationRequestStatus, type ReservationRequest } from "./ReservationRequestsModels";
import { useAction } from "../../core/hooks/useAction";
import { acceptReservationRequest, declineReservationRequest } from "./requestActions";
import { useNotifications } from "../../core/hooks/useNotifications";
import { ResultStatus } from "../../core/contexts/Result";
import { extractErrorMessage } from "../../core/utils/errors";
import { ReservationRequestsSearchForm } from "./ReservationRequestsSearchForm";
import { useUsersMap } from "../users/useUsersMap";
import { useAccommodationsByHost } from "../accommodations/useAccommodations";
import { SelectAccomodation } from "../common/SelectAccommodation";
import { useAccommodationsMap } from "../accommodations/useAccommodationsMap";
import { statusToText } from "./utils";

const ReservationRequestRow: FC<{
  reservationRequest: ReservationRequest;
  onAcceptClick: () => any;
  onDeclineClick: () => any;
}> = ({ reservationRequest, onAcceptClick, onDeclineClick }) => {
  return (
    <>
      <li className="mb-10">
        <div className="py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex min-w-full">
            <div className="flex-grow space-y-2">
              <p>
                Reservation requested by{" "}
                <Link href={`/users/${reservationRequest.guestId}`}>
                  <span>{reservationRequest.guest}</span>
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
              <UserSpecific userId={reservationRequest.hostId || ""}>
                <div className="flex space-x-1 justify-end">
                  <CheckCircleIcon className="inline-block h-5 w-5" onClick={onAcceptClick} />
                  <XCircleIcon className="inline-block h-5 w-5" onClick={onDeclineClick} />
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

  const guestIds =
    reservationRequests?.map((reservationRequest) => reservationRequest.guestId) ?? [];
  const { usersMap: guestsMap } = useUsersMap(guestIds);

  const accommodationIds =
    reservationRequests?.map((reservationRequest) => reservationRequest.accomodationId) ?? [];
  const { accommodationsMap } = useAccommodationsMap(accommodationIds);

  const acceptRequestAction = useAction<string>(acceptReservationRequest, {
    onSuccess: () => {
      notificationsService.success("You have successfully accepted reservation request.");
      setResult({ status: ResultStatus.Ok, type: "ACCEPT_RESERVATION_REQUEST" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "ACCEPT_RESERVATION_REQUEST" });
    },
  });

  const declineRequestAction = useAction<string>(declineReservationRequest, {
    onSuccess: () => {
      notificationsService.success("You have successfully declined reservation request.");
      setResult({ status: ResultStatus.Ok, type: "DECLINE_RESERVATION_REQUEST" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "DECLINE_RESERVATION_REQUEST" });
    },
  });

  return (
    <>
      <ol>
        {reservationRequests?.map((reservationRequest: ReservationRequest, i: number) => {
          const guest = guestsMap[reservationRequest.guestId];
          reservationRequest.guest = `${guest?.firstName} ${guest?.lastName}`;

          const accommodation = accommodationsMap[reservationRequest.accomodationId];
          reservationRequest.hostId = accommodation?.hostId;

          return (
            <ReservationRequestRow
              reservationRequest={reservationRequest}
              onAcceptClick={() => acceptRequestAction(reservationRequest.id)}
              onDeclineClick={() => declineRequestAction(reservationRequest.id)}
              key={i}
            />
          );
        })}
      </ol>
    </>
  );
};

type HostReservationRequestsProps = {
  hostId: string;
};

export const HostReservationRequests: FC<HostReservationRequestsProps> = ({ hostId }) => {
  const { accommodations } = useAccommodationsByHost(hostId);

  const [accommodationId, setAccommodationId] = useState<any>("");
  const [filters, setFilters] = useState<any>({ status: "" });
  const { result, setResult } = useRequestsResult();
  const { reservationRequests, isLoading } = useReservationRequestsByAccommodation(
    accommodationId,
    filters,
    [result]
  );

  useEffect(() => {
    setAccommodationId((accommodations?.at(0) as any).accommodationId ?? "");
  }, [accommodations]);

  useEffect(() => {
    if (!result) return;

    setResult(undefined);
  }, [result, setResult]);

  if (isLoading) return <></>;

  return (
    <>
      <div className="mt-10 space-y-5">
        <SelectAccomodation
          accommodations={accommodations}
          accommodationId={accommodationId}
          onAccommodationSelected={setAccommodationId}
        />
        <ReservationRequestsSearchForm initialFilters={filters} onFiltersChange={setFilters} />
        <ReservationRequestsPage reservationRequests={reservationRequests} />
      </div>
    </>
  );
};
