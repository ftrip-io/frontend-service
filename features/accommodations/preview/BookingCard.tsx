import { useState, type FC, useEffect, useMemo } from "react";
import { type PriceDiff } from "../AccommodationModels";
import moment from "moment";
import IntegerInput from "../../../core/components/IntegerInput";
import { Button } from "../../../core/components/Button";
import { parseCronExpression } from "../../../core/utils/cron";
import { type PriceInfo, calculatePriceInfo } from "../../../core/utils/calculatePrice";
import { createReservationRequest } from "../../requests/requestActions";
import { useAction } from "../../../core/hooks/useAction";
import { notifications } from "../../../core/hooks/useNotifications";
import { useRequestsResult } from "../../requests/useRequestsResult";
import { ResultStatus } from "../../../core/contexts/Result";
import { extractErrorMessage } from "../../../core/utils/errors";
import { useAuthContext } from "../../../core/contexts/Auth";
import { type CreateReservationRequest } from "../../requests/ReservationRequestsModels";
import { useRouter } from "next/router";

type BookingCardProps = {
  id: string;
  price: number;
  isPerGuest: boolean;
  priceDiffs: PriceDiff[];
  checkIn?: Date;
  checkOut?: Date;
  minGuests: number;
  maxGuests: number;
};

export const BookingCard: FC<BookingCardProps> = ({
  id,
  price,
  isPerGuest,
  priceDiffs,
  checkIn,
  checkOut,
  minGuests,
  maxGuests,
}) => {
  const router = useRouter();

  const [priceInfo, setPriceInfo] = useState<PriceInfo>();
  const [showDetails, setShowDetails] = useState(false);
  const [guests, setGuests] = useState(+(router.query?.guestNum || 1));

  const guestId = useAuthContext().user?.id ?? "";

  const { setResult } = useRequestsResult();

  const createRequestAction = useAction<CreateReservationRequest>(createReservationRequest, {
    onSuccess: () => {
      notifications.success("You have successfully created reservation request.");
      setResult({ status: ResultStatus.Ok, type: "CREATED_REQUEST" });
    },
    onError: (error: any) => {
      const messages = extractErrorMessage(error).split("\n");
      for (let message of messages) {
        notifications.error(message);
      }

      setResult({ status: ResultStatus.Error, type: "CREATED_REQUEST" });
    },
  });

  const priceDiffData = useMemo(
    () =>
      priceDiffs.map((pd) => ({
        numbers: parseCronExpression(pd.when),
        percentage: pd.percentage,
      })),
    [priceDiffs]
  );

  useEffect(
    () =>
      setPriceInfo(calculatePriceInfo(guests, isPerGuest, price, priceDiffData, checkIn, checkOut)),
    [checkIn, checkOut, guests, isPerGuest, price, priceDiffData]
  );

  return (
    <div className="m-10 p-5 border-2 rounded-2xl">
      <h2 className="mb-3 text-xl">
        $ {(priceInfo ? priceInfo.total / priceInfo.days : price).toFixed(0)} night
      </h2>
      <div className="flex w-full">
        <div className="border px-2 py-1 w-1/2">
          <label className="text-xs">CHECK-IN</label>
          <p>{checkIn ? moment(checkIn).format("YYYY-MM-DD") : "Add date"}</p>
        </div>
        <div className="border px-2 py-1 w-1/2">
          <label className="text-xs">CHECK-OUT</label>
          <p>{checkOut ? moment(checkOut).format("YYYY-MM-DD") : "Add date"}</p>
        </div>
      </div>
      <div className="border px-2 py-1 w-full">
        <label className="text-xs">GUESTS</label>
        <IntegerInput onChange={setGuests} value={guests} min={minGuests} max={maxGuests} />
      </div>
      <div className="mt-2 w-full">
        <Button
          className="w-full"
          onClick={() =>
            createRequestAction({
              guestId,
              accomodationId: id,
              guestNumber: guests,
              datePeriod: {
                dateFrom: checkIn as Date,
                dateTo: checkOut as Date,
              },
            })
          }
        >
          Reserve
        </Button>
      </div>
      {priceInfo && (
        <>
          <p className="my-3 underline cursor-pointer" onClick={() => setShowDetails(!showDetails)}>
            $ {(priceInfo.total / priceInfo.days).toFixed(0)} x {priceInfo.days} nights = ${" "}
            {priceInfo.total.toFixed(0)}
          </p>
          {showDetails && (
            <div>
              Price breakdown
              <ul className="border-y">
                {priceInfo.items?.map((item, i) => (
                  <li key={i} className="justify-between">
                    <span>
                      {moment(item.date).format("YYYY-MM-DD")}
                      {item.priceDiffPercent
                        ? ` (${item.priceDiffPercent > 0 ? "+" : ""}${item.priceDiffPercent}%)`
                        : ""}
                    </span>
                    <span className="float-right">$ {item.price.toFixed(0)}</span>
                  </li>
                ))}
              </ul>
              <div className="justify-between font-semibold">
                <span>Total</span>
                <span className="float-right">$ {priceInfo.total.toFixed(0)}</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
