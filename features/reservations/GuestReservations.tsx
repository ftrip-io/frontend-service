import { type FC, useEffect, useState } from "react";
import { useReservationsResult } from "./useReservationsResult";
import { useReservationsByGuest } from "./useReservations";
import { type Reservation } from "./ReservationsModels";
import { useNotifications } from "../../core/hooks/useNotifications";
import { useAccommodationsMap } from "../accommodations/useAccommodationsMap";
import { useAction } from "../../core/hooks/useAction";
import { cancelReservation } from "./reservationActions";
import { ResultStatus } from "../../core/contexts/Result";
import { extractErrorMessage } from "../../core/utils/errors";
import { UserSpecific } from "../../core/components/UserSpecific";
import moment from "moment";
import Link from "next/link";
import { ReservationsSearchForm } from "./ReservationsSearchForm";
import { usePhotos } from "../accommodations/usePhotos";
import { Button } from "../../core/components/Button";

const ReservationRow: FC<{
  reservation: Reservation;
  onCancelClick: () => any;
}> = ({ reservation, onCancelClick }) => {
  const { photoUrls } = usePhotos(reservation.accomodationId);

  const canBeCancelled =
    moment()
      .subtract(1, "days")
      .diff(moment(new Date(reservation.datePeriod.dateFrom))) < 0;

  return (
    <>
      <div className="w-60 h-[420px]  bg-white rounded-2xl shadow flex-col justify-center items-center gap-4 inline-flex m-1">
        <div className="w-60 h-[200px] shadow justify-center items-center inline-flex">
          {photoUrls.length ? (
            <img className="w-60 h-[200px]" src={photoUrls?.[0]} />
          ) : (
            <div className="w-60 h-[200px] bg-indigo-500 bg-opacity-80" />
          )}
        </div>
        <div className="self-stretch h-[135px] px-4 pb-3 border-b flex-col justify-start items-center gap-3 flex">
          <div className="self-stretch h-[135px] flex-col justify-start items-start gap-1.5 flex">
            <div className="self-stretch text-center text-gray-900 text-[24px] font-bold leading-normal">
              <Link href={`/accommodations/${reservation.accomodationId}`}>
                <span>{reservation.accommodation}</span>
              </Link>
            </div>
            <div className="w-52 text-center text-zinc-800 text-[12px] font-normal leading-tight">
              {moment(reservation.datePeriod.dateFrom).format("DD.MM.yyyy")} -{" "}
              {moment(reservation.datePeriod.dateTo).format("DD.MM.yyyy")} <br />
              {reservation.guestNumber} {reservation.guestNumber === 1 ? "guest" : "guests"}{" "}
            </div>
            <div className="w-52 text-center">
              <span className="text-black text-[14px] font-semibold leading-tight">
                Total price: {reservation.totalPrice}$
              </span>
            </div>
            <div className="w-52 h-[18px] mt-2 text-right text-gray-900 text-opacity-80 text-[12px] font-normal leading-normal">
              Created {moment(reservation.createdAt).fromNow()}
            </div>
          </div>
        </div>
        {!reservation.isCancelled && canBeCancelled ? (
          <UserSpecific userId={reservation.guestId}>
            <div className="w-[86px] h-[26px] px-5 py-3 bg-indigo-500 rounded-lg justify-center items-center gap-[8px] inline-flex">
              <button
                className="text-center text-white text-[14px] font-semibold leading-normal"
                onClick={onCancelClick}
              >
                Cancel
              </button>
            </div>
          </UserSpecific>
        ) : (
          <></>
        )}
        {reservation.isCancelled ? (
          <div className="w-[75px] h-[18px] px-5 py-3 ml-3 bg-amber-200 rounded-lg justify-center items-center gap-[8px] inline-flex">
            <div className="text-center text-white text-[14px] font-semibold leading-normal">
              Cancelled
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

const ReservationsPage: FC<{ reservations: Reservation[] }> = ({ reservations }) => {
  const notificationsService = useNotifications();
  const { setResult } = useReservationsResult();

  const accommodationIds = reservations?.map((reservation) => reservation.accomodationId) ?? [];

  const { accommodationsMap } = useAccommodationsMap(accommodationIds);

  const cancelReservationAction = useAction<string>(cancelReservation, {
    onSuccess: () => {
      notificationsService.success("You have successfully cancelled reservation.");
      setResult({ status: ResultStatus.Ok, type: "CANCEL_RESERVATION" });
    },
    onError: (error: any) => {
      notificationsService.error(extractErrorMessage(error));
      setResult({ status: ResultStatus.Error, type: "CANCEL_RESERVATION" });
    },
  });

  return (
    <>
      {reservations.map((reservation: Reservation, i: number) => {
        const accommodation = accommodationsMap[reservation.accomodationId];
        reservation.accommodation = accommodation?.title;

        return (
          <ReservationRow
            reservation={reservation}
            onCancelClick={() => cancelReservationAction(reservation.id)}
            key={i}
          />
        );
      })}
    </>
  );
};

type GuestReservationsProps = {
  guestId: string;
};

export const GuestReservations: FC<GuestReservationsProps> = ({ guestId }) => {
  const [filters, setFilters] = useState<any>({ includeCancelled: "1" });
  const { result, setResult } = useReservationsResult();
  const { reservations, isLoading } = useReservationsByGuest(guestId, filters, [result]);

  useEffect(() => {
    if (!result) return;

    setResult(undefined);
  }, [result, setResult]);

  if (isLoading || !reservations) return <></>;

  return (
    <>
      <div className="mt-10 space-y-5">
        <ReservationsSearchForm initialFilters={filters} onFiltersChange={setFilters} />
        <ReservationsPage reservations={reservations} />
      </div>
    </>
  );
};
