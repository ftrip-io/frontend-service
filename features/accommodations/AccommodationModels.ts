export enum PlaceType {
  ENTIRE_PLACE,
  PRIVATE_ROOM,
  SHARED_ROOM,
}

export type Accommodation = {
  id: string;
  title: string;
  description: string;
  placeType: PlaceType;
  isDecicatedForGuests: boolean;
  minGuests: number;
  maxGuests: number;
  bedroomCount: number;
  bedCount: number;
  bathroomCount: number;
  noticePeriod: number;
  bookingAdvancePeriod: number;
  checkInFrom: number;
  checkInTo: number;
  bookBeforeTime: number;
  minNights: number;
  maxNights: number;
  price: number;
  isPerGuest: boolean;
  hostId: string;
  houseRules: string;
  locationId: string;
  location: Location;
  propertyTypeId: string;
  propertyType: PropertyType;
  amenities: AccommodationAmenity[];
  availabilities: Availability[];
  priceDiffs: PriceDiff[];
};

export type Location = {
  id: string;
  country: string;
  region: string;
  city: string;
  postalCode: string;
  address: string;
  apt: string;
  latitude: number;
  longitude: number;
  saved?: boolean;
};

export type PropertyType = {
  id: string;
  name: string;
  description: string;
};

export type Amenity = {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: { name: string };
};

export type AccommodationAmenity = {
  id: string;
  amenityId: string;
  amenity: Amenity;
  accommodationId: string;
  isPresent: boolean;
};

export type Availability = {
  id: string;
  fromDate: Date;
  toDate: Date;
  isAvailable: boolean;
  accommodationId: string;
};

export type PriceDiff = {
  id: string;
  when: string;
  percentage: number;
  accommodationId: string;
};
