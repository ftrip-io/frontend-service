import { type PlaceType, type Location } from "../AccommodationModels";

export type SearchFilters = {
  location: string;
  fromDate: string;
  toDate: string;
  guestNum: number;
};

export type AccommodationSearchInfo = {
  accommodationId: string;
  title: string;
  description: string;
  placeType: PlaceType;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
  location: Location;
  totalPrice: number;
  price: number;
  isPerGuest: boolean;
};
