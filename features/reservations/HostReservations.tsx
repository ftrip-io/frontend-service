import { type FC, useEffect, useState } from "react";
import { useReservationsResult } from "./useReservationsResult";
import { useReservationsByAccommodation } from "./useReservations";
import { type Reservation } from "./ReservationsModels";
import moment from "moment";
import Link from "next/link";
import { ReservationsSearchForm } from "./ReservationsSearchForm";
import { useUsersMap } from "../users/useUsersMap";
import { useAccommodationsByHost } from "../accommodations/useAccommodations";
import { SelectAccomodation } from "../common/SelectAccommodation";

const ReservationRow: FC<{
  reservation: Reservation;
}> = ({ reservation }) => {
  return (
    <>
      <li className="mb-10">
        <div className="py-2 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="space-y-2">
            <p>
              Reservation by{" "}
              <Link href={`/users/${reservation.guestId}`}>
                <span>{reservation.guest}</span>
              </Link>{" "}
              for {reservation.guestNumber} {reservation.guestNumber === 1 ? "guest" : "guests"}{" "}
              from {new Date(reservation.datePeriod.dateFrom).toDateString()} to{" "}
              {new Date(reservation.datePeriod.dateTo).toDateString()}{" "}
              {reservation.isCancelled ? "(Cancelled)" : ""}
            </p>

            <p className="text-sm text-gray-700">
              created {moment(reservation.createdAt).fromNow()}
            </p>
          </div>
        </div>
      </li>
    </>
  );
};

const ReservationsPage: FC<{ reservations: Reservation[] }> = ({ reservations }) => {
  const guestIds = reservations?.map((reservation) => reservation.guestId) ?? [];

  const { usersMap: guestsMap } = useUsersMap(guestIds);

  return (
    <>
      <ol>
        {reservations?.map((reservation: Reservation, i: number) => {
          const guest = guestsMap[reservation.guestId];
          reservation.guest = `${guest?.firstName} ${guest?.lastName}`;

          return <ReservationRow reservation={reservation} key={i} />;
        })}
      </ol>
    </>
  );
};

type HostReservationsProps = {
  hostId: string;
};

export const HostReservations: FC<HostReservationsProps> = ({ hostId }) => {
  const { accommodations } = useAccommodationsByHost(hostId);

  const [accommodationId, setAccommodationId] = useState<any>("");
  const [filters, setFilters] = useState<any>({ includeCancelled: "1" });
  const { result, setResult } = useReservationsResult();
  const { reservations, isLoading } = useReservationsByAccommodation(accommodationId, filters, [
    result,
  ]);

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
        <ReservationsSearchForm initialFilters={filters} onFiltersChange={setFilters} />
        <ReservationsPage reservations={reservations} />
      </div>
    </>
  );
};
