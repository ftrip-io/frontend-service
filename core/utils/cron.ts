export function toCronExpression(
  monthDays: number[],
  months: number[],
  weekDays: number[]
): string {
  return `0 0 ${toIntervals(monthDays)} ${toIntervals(months)} ${toIntervals(weekDays)}`;
}

export function parseCronExpression(cron: string) {
  const parts = cron.split(" ");
  return {
    monthDays: toNumbers(parts[2]),
    months: toNumbers(parts[3]),
    weekDays: toNumbers(parts[4]),
  };
}

export function matches(
  date: Date,
  monthDays: number[],
  months: number[],
  weekDays: number[]
): boolean {
  const month = date.getMonth() + 1;
  const monthDay = date.getDate();
  const weekDay = date.getDay() || 7;
  return (
    (!(monthDays.length || weekDays.length) ||
      monthDays.includes(monthDay) ||
      weekDays.includes(weekDay)) &&
    (!months.length || months.includes(month))
  );
}

function toIntervals(numbers: number[]): string {
  if (!numbers.length) return "*";
  numbers.sort();
  let a = 0,
    b = 0;
  let s = "";
  for (const e of numbers) {
    if (a === 0) {
      a = e;
      continue;
    }
    if (b === 0) {
      if (e === a + 1) {
        b = e;
      } else {
        s += `${a},`;
        a = e;
      }
      continue;
    }
    if (e === b + 1) {
      b = e;
      continue;
    }
    s += `${a}-${b},`;
    a = e;
    b = 0;
  }
  s += b === 0 ? `${a}` : `${a}-${b}`;
  return s;
}

function toNumbers(intervals: string): number[] {
  if (intervals === "*") return [];
  return intervals
    .split(",")
    .map((r) => r.split("-").map((s) => +s))
    .reduce((ns, rng) => {
      if (rng.length < 2) {
        ns.push(rng[0]);
        return ns;
      }
      for (let i = rng[0]; i <= rng[1]; i++) ns.push(i);
      return ns;
    }, []);
}

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;
