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
import { Button } from "../../core/components/Button";
import { usePhotos } from "../accommodations/usePhotos";

const ReservationRequestRow: FC<{
  reservationRequest: ReservationRequest;
  onDeleteClick: () => any;
}> = ({ reservationRequest, onDeleteClick }) => {
  const { photoUrls } = usePhotos(reservationRequest.accomodationId);

  return (
    <>
      <div className="w-60 h-[390px] pb-[40px] bg-white rounded-2xl shadow flex-col justify-center items-center gap-4 inline-flex mb-4 m-1 mt-2">
        <div className="w-60 h-[200px] shadow justify-center items-center inline-flex">
          {photoUrls.length ? (
            <img className="w-60 h-[200px]" src={photoUrls?.[0]} />
          ) : (
            <div className="w-60 h-[200px] bg-indigo-500 bg-opacity-80" />
          )}
        </div>
        <div className="self-stretch h-[150px] px-4 pb-3 border-b flex-col justify-start items-center gap-3 flex">
          <div className="self-stretch h-[135px] flex-col justify-center items-center gap-1.5 flex">
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

            <div className="self-stretch text-center text-gray-900 text-[24px] font-bold leading-normal">
              <Link href={`/accommodations/${reservationRequest.accomodationId}`}>
                <span>{reservationRequest.accommodation}</span>
              </Link>
            </div>
            <div className="w-52 text-center text-zinc-800 text-[12px] font-normal leading-tight">
              {moment(reservationRequest.datePeriod.dateFrom).format("DD.MM.yyyy")} -{" "}
              {moment(reservationRequest.datePeriod.dateTo).format("DD.MM.yyyy")} <br />
              {reservationRequest.guestNumber}{" "}
              {reservationRequest.guestNumber === 1 ? "guest" : "guests"}{" "}
            </div>
            <div className="w-52 text-center">
              <span className="text-black text-[14px] font-semibold leading-tight">
                Total price: {reservationRequest.totalPrice}$
              </span>
            </div>
            <div className="w-[228px] h-[18px] mt-2 text-right text-gray-900 text-opacity-80 text-[12px] font-normal leading-normal">
              Created {moment(reservationRequest.createdAt).fromNow()}
            </div>
          </div>
        </div>

        {reservationRequest.status === ReservationRequestStatus.Waiting ? (
          <div className="w-[75px] h-[20px] px-5 py-3 ml-3 bg-indigo-500 rounded-lg justify-center items-center gap-[6px] inline-flex">
            <button
              className="text-center text-white text-[14px] font-semibold leading-normal"
              onClick={onDeleteClick}
            >
              Delete
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
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
