import axios from "axios";
import { type Accommodation } from "./AccommodationModels";

export type AmenitiesList = {
  amenityId: string;
  isPresent: boolean;
}[];

export type CreateAccommodation = Omit<
  Accommodation,
  "id" | "locationId" | "propertyType" | "amenities"
> & { amenities: AmenitiesList };

export const uploadFiles = (files: any, order: number[], id: string) => {
  const fd = new FormData();
  order.forEach((o, i) => fd.append("images", files[o], `${i}-${files[o].name}`));
  return axios.post(`/photoService/api/images/${id}`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export function createAccommodation(accommodation: CreateAccommodation) {
  return axios.post("/catalogService/api/accommodations", accommodation);
}
