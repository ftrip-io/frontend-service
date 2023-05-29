import { type FC } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { type Location } from "../AccommodationModels";

const markerIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

const MapPreview: FC<{ location: Location }> = ({ location }) => {
  return (
    <div className="m-5">
      <MapContainer
        scrollWheelZoom={false}
        doubleClickZoom={false}
        center={new L.LatLng(location.latitude, location.longitude)}
        zoom={12}
        style={{ height: "50vh" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={new L.LatLng(location.latitude, location.longitude)} icon={markerIcon} />
      </MapContainer>
    </div>
  );
};
export default MapPreview;
