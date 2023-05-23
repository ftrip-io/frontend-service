import axios from "axios";
import {
  PlaceType,
  type Accommodation,
  type Availability,
  type PriceDiff,
  type Location,
} from "./AccommodationModels";

export type ImageOrder = {
  url: string;
  index?: number;
  name?: string;
};

export function uploadFiles(files: File[], order: ImageOrder[], id: string) {
  const fd = new FormData();
  order.forEach((o) => {
    if (o.index !== undefined) fd.append("images", files[o.index], o.name || files[o.index].name);
  });
  return axios.post(`/photoService/api/images/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export function renameFiles(files: { old: string; new?: string }[], id: string) {
  return axios.put(`/photoService/api/images/${id}`, files);
}

export function deleteFolder(id: string) {
  return axios.delete(`/photoService/api/images/${id}`);
}

export type AmenitiesList = {
  id?: string;
  amenityId: string;
  isPresent: boolean;
}[];

export type CreateAccommodation = Omit<
  Accommodation,
  "id" | "locationId" | "propertyType" | "amenities"
> & { amenities: AmenitiesList };

export function createAccommodation(accommodation: CreateAccommodation) {
  return axios.post("/catalogService/api/accommodations", accommodation);
}

export type UpdateAccommodation = {
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
  checkInFrom: number;
  checkInTo: number;
  bookBeforeTime: number;
  minNights: number;
  maxNights: number;
  houseRules: string;
  propertyTypeId: string;
};

export function fromAccommodation(a: Accommodation): UpdateAccommodation {
  const {
    id,
    propertyType,
    hostId,
    location,
    locationId,
    amenities,
    availabilities,
    bookingAdvancePeriod,
    price,
    isPerGuest,
    priceDiffs,
    ...update
  } = a;
  return update;
}

export function updateAccommodation(id: string) {
  return (accommodationUpdate: UpdateAccommodation) =>
    axios.put(`/catalogService/api/accommodations/${id}`, accommodationUpdate);
}

export type UpdateAccommodationLocation = {
  location: Location;
};

export function updateAccommodationLocation(id: string) {
  return (accommodationUpdate: UpdateAccommodationLocation) =>
    axios.put(`/catalogService/api/accommodations/${id}/location`, accommodationUpdate);
}

export type UpdateAccommodationAmenities = {
  amenities: AmenitiesList;
};

export function updateAccommodationAmenities(id: string) {
  return (accommodationUpdate: UpdateAccommodationAmenities) =>
    axios.put(`/catalogService/api/accommodations/${id}/amenities`, accommodationUpdate);
}

export type UpdateAccommodationAvailabilities = {
  bookingAdvancePeriod: number;
  availabilities: Availability[];
};

export function updateAccommodationAvailabilities(id: string) {
  return (accommodationUpdate: UpdateAccommodationAvailabilities) =>
    axios.put(`/catalogService/api/accommodations/${id}/availabilities`, accommodationUpdate);
}

export type UpdateAccommodationPricing = {
  price: number;
  isPerGuest: boolean;
  priceDiffs: PriceDiff[];
};

export function updateAccommodationPricing(id: string) {
  return (accommodationUpdate: UpdateAccommodationPricing) =>
    axios.put(`/catalogService/api/accommodations/${id}/pricing`, accommodationUpdate);
}

export function deleteAccommodation(id: string) {
  return axios.delete(`/catalogService/api/accommodations/${id}`);
}
