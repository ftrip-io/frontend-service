export function groupBy<TVal>(data: TVal[], prop: any): { [Key: string]: TVal[] } {
  return (
    data?.reduce((acc: { [Key: string]: TVal[] }, d: any) => {
      if (Object.keys(acc).includes(d[prop])) return acc;

      acc[d[prop]] = data.filter((g: any) => g[prop] === d[prop]);
      return acc;
    }, {}) ?? {}
  );
}
