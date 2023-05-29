import { matches } from "./cron";

export type PriceInfo = {
  items: { date: Date; price: number; priceDiffPercent?: number }[];
  days: number;
  total: number;
};

type PriceDiffData = {
  numbers: {
    monthDays: number[];
    months: number[];
    weekDays: number[];
  };
  percentage: number;
}[];

export function calculatePriceInfo(
  guests: number,
  isPerGuest: boolean,
  regularPrice: number,
  priceDiffData: PriceDiffData,
  checkIn?: Date,
  checkOut?: Date
) {
  if (!checkIn || !checkOut) return;
  let date = new Date(checkIn);
  const info: PriceInfo = { items: [], days: 0, total: 0 };
  while (date < checkOut) {
    let price = isPerGuest ? guests * regularPrice : regularPrice;
    const priceDiffPercent = priceDiffData
      .filter((d) => matches(date, d.numbers.monthDays, d.numbers.months, d.numbers.weekDays))
      .map((d) => d.percentage)
      .reduce((prev, curr) => prev + curr, 0);
    price += (priceDiffPercent / 100) * price;
    info.items.push({ date: new Date(date), price, priceDiffPercent });
    info.days++;
    info.total += price;
    date.setDate(date.getDate() + 1);
  }
  return info;
}
