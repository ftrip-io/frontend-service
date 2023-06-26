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
import { XCircleIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import Link from "next/link";
import { ReservationsSearchForm } from "./ReservationsSearchForm";

const ReservationRow: FC<{
  reservation: Reservation;
  onCancelClick: () => any;
}> = ({ reservation, onCancelClick }) => {
  const canBeCancelled =
    moment()
      .subtract(1, "days")
      .diff(moment(new Date(reservation.datePeriod.dateFrom))) < 0;

  return (
    <>
      <li className="mb-10">
        <div className="py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex min-w-full">
            <div className="flex-grow space-y-2">
              <p>
                Reservation of{" "}
                <Link href={`/accommodations/${reservation.accomodationId}`}>
                  <span>{reservation.accommodation}</span>
                </Link>{" "}
                for {reservation.guestNumber} {reservation.guestNumber === 1 ? "guest" : "guests"}{" "}
                from {new Date(reservation.datePeriod.dateFrom).toDateString()} to{" "}
                {new Date(reservation.datePeriod.dateTo).toDateString()}{" "}
                {reservation.isCancelled ? "(Cancelled)" : ""}
              </p>
              <p>Total price: {reservation.totalPrice}$</p>
              <p className="text-sm text-gray-700">
                created {moment(reservation.createdAt).fromNow()}
              </p>
            </div>

            {!reservation.isCancelled && canBeCancelled ? (
              <UserSpecific userId={reservation.guestId}>
                <div className="space-x-2 justify-end">
                  <XCircleIcon className="inline-block h-5 w-5" onClick={onCancelClick} />
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
      <ol>
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
      </ol>
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
