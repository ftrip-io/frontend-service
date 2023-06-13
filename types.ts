type UserSpecificProfilePageProps = {
  userId: string;
};

type DatePeriod = {
  dateFrom: Date;
  dateTo: Date;
};

type PageResult<T> = {
  entities: T[];
  totalPages: number;
  totalEntities: number;
};

export type { UserSpecificProfilePageProps, PageResult, DatePeriod };
