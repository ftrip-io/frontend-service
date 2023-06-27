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
import { usePhotos } from "../accommodations/usePhotos";
import { Button } from "../../core/components/Button";

const ReservationRequestRow: FC<{
  reservationRequest: ReservationRequest;
  onAcceptClick: () => any;
  onDeclineClick: () => any;
}> = ({ reservationRequest, onAcceptClick, onDeclineClick }) => {
  const { photoUrls } = usePhotos(reservationRequest.accomodationId);
  return (
    <>
      <div className="w-60 h-[425px] pb-[20px] bg-white rounded-2xl shadow flex-col justify-center items-center gap-2 inline-flex m-1">
        <div className="w-60 h-[200px] shadow justify-center items-center inline-flex">
          {photoUrls.length ? (
            <img className="w-60 h-[200px]" src={photoUrls?.[0]} />
          ) : (
            <div className="w-60 h-[200px] bg-indigo-500 bg-opacity-80" />
          )}
        </div>
        <div className="self-stretch h-[180px] px-4 pb-3 border-b flex-col justify-start items-center gap-3 flex">
          <div className="self-stretch h-[170px] flex-col justify-start items-start gap-1.5 flex">
            <div className="self-stretch text-center text-gray-900 text-[16px] font-semibold leading-normal">
              {reservationRequest.status == ReservationRequestStatus.Accepted ? (
                <div className="w-[75px] h-[18px] px-5 py-3 ml-3 bg-green-200 rounded-lg justify-center items-center gap-[8px] inline-flex">
                  <div className="text-center text-white text-[14px] font-semibold leading-normal">
                    Accepted
                  </div>
                </div>
              ) : (
                <div className="w-[75px] h-[18px] px-5 py-3 ml-3 bg-amber-200 rounded-lg justify-center items-center gap-[8px] inline-flex">
                  <div className="text-center text-white text-[14px] font-semibold leading-normal">
                    {statusToText(reservationRequest.status)}
                  </div>
                </div>
              )}
              <br />
              Reservation by{" "}
              <Link href={`/users/${reservationRequest.guestId}`}>
                <span>{reservationRequest.guest}</span>
              </Link>{" "}
            </div>
            <div className="w-52 text-center text-zinc-800 text-[12px] font-normal leading-tight">
              {moment(reservationRequest.datePeriod.dateFrom).format("DD.MM.yyyy")} -{" "}
              {moment(reservationRequest.datePeriod.dateTo).format("DD.MM.yyyy")} <br />
              {reservationRequest.guestNumber}{" "}
              {reservationRequest.guestNumber === 1 ? "guest" : "guests"}{" "}
            </div>
            <div className="w-52 text-center">
              <span className="text-gray-900 text-[12px] font-bold leading-tight">
                Total price: {reservationRequest.totalPrice}$
              </span>
            </div>
            <div className="w-52 h-[18px] text-right text-gray-900 text-opacity-80 mt-3 text-[12px] font-normal leading-normal">
              Created {moment(reservationRequest.createdAt).fromNow()}
            </div>
          </div>
        </div>

        <div className="w-[228px] h-[18px] pb-[10px] text-right text-gray-900 text-opacity-80 text-[12px] font-normal leading-normal">
          {reservationRequest.status === ReservationRequestStatus.Waiting ? (
            <UserSpecific userId={reservationRequest.hostId || ""}>
              <div className="flex space-x-1 justify-center">
                <div className="w-[75px] h-[20px] px-5 py-3 ml-3 mb-2 bg-indigo-500 rounded-lg justify-center items-center gap-[8px] inline-flex">
                  <button
                    className="text-center text-white text-[14px] font-semibold leading-normal"
                    onClick={onAcceptClick}
                  >
                    Accept
                  </button>
                </div>
                <div className="w-[75px] h-[20px] px-5 py-3 ml-3 mb-2 bg-indigo-500 rounded-lg justify-center items-center gap-[8px] inline-flex">
                  <button
                    className="text-center text-white text-[14px] font-semibold leading-normal"
                    onClick={onDeclineClick}
                  >
                    Decline
                  </button>
                </div>
              </div>
            </UserSpecific>
          ) : (
            <></>
          )}
        </div>
      </div>
      {/* <li className="mb-10">
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
              <p>Total price: {reservationRequest.totalPrice}$</p>
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
      </li> */}
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
