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
import { usePhotos } from "../accommodations/usePhotos";

const ReservationRow: FC<{
  reservation: Reservation;
}> = ({ reservation }) => {
  const { photoUrls } = usePhotos(reservation.accomodationId);
  return (
    <>
      <div className="w-60 h-[382px] pb-[20px] bg-white rounded-2xl shadow flex-col justify-center items-center gap-2 inline-flex m-1">
        <div className="w-60 h-[200px] shadow justify-center items-center inline-flex">
          {photoUrls.length ? (
            <img className="w-60 h-[200px]" src={photoUrls?.[0]} />
          ) : (
            <div className="w-60 h-[200px] bg-indigo-500 bg-opacity-80" />
          )}
        </div>
        <div className="self-stretch h-[150px] px-4 pb-3 border-b flex-col justify-start items-center gap-3 flex">
          <div className="self-stretch h-[140px] flex-col justify-start items-start gap-1.5 flex">
            <div className="self-stretch text-center text-gray-900 text-[16px] font-semibold leading-normal">
              {reservation.isCancelled ? (
                <div className="w-[75px] h-[18px] px-5 py-3 ml-3 bg-amber-200 rounded-lg justify-center items-center gap-[8px] inline-flex">
                  <div className="text-center text-white text-[14px] font-semibold leading-normal">
                    Cancelled
                  </div>
                </div>
              ) : (
                <></>
              )}
              <br />
              Reservation by{" "}
              <Link href={`/users/${reservation.guestId}`}>
                <span>{reservation.guest}</span>
              </Link>{" "}
            </div>
            <div className="w-52 text-center text-zinc-800 text-[12px] font-normal leading-tight">
              {moment(reservation.datePeriod.dateFrom).format("DD.MM.yyyy")} -{" "}
              {moment(reservation.datePeriod.dateTo).format("DD.MM.yyyy")} <br />
              {reservation.guestNumber} {reservation.guestNumber === 1 ? "guest" : "guests"}{" "}
            </div>
            <div className="w-52 text-center">
              <span className="text-gray-900 text-[12px] font-bold leading-tight">
                Total price: {reservation.totalPrice}$
              </span>
            </div>
          </div>
        </div>

        <div className="w-52 h-[18px] pb-[10px] text-right text-gray-900 text-opacity-80 text-[12px] font-normal leading-normal">
          Created {moment(reservation.createdAt).fromNow()}
        </div>
      </div>
    </>
  );
};

const ReservationsPage: FC<{ reservations: Reservation[] }> = ({ reservations }) => {
  const guestIds = reservations?.map((reservation) => reservation.guestId) ?? [];

  const { usersMap: guestsMap } = useUsersMap(guestIds);

  return (
    <>
      {reservations?.map((reservation: Reservation, i: number) => {
        const guest = guestsMap[reservation.guestId];
        reservation.guest = `${guest?.firstName} ${guest?.lastName}`;

        return <ReservationRow reservation={reservation} key={i} />;
      })}
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
