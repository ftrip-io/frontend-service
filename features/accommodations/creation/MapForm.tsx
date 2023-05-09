import { type FC, useMemo, useRef, useState } from "react";
import { type CreateAccommodation } from "../createAccommodation";
import { type Location } from "../AccommodationModels";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "../useLocation";
import { Spinner } from "../../../core/components/Spinner";

const markerIcon = L.icon({
  iconUrl: "/images/marker-icon.png",
  iconSize: [20, 30],
  iconAnchor: [10, 30],
});

type MapFormProps = {
  updateFields: (fields: Partial<CreateAccommodation>) => void;
  location: Location;
};

const DraggableMarker: FC<{
  center: L.LatLngExpression;
  r: number;
  setLocation: (loc: L.LatLng) => void;
}> = ({ center, r, setLocation }) => {
  const [position, setPosition] = useState(center);
  const markerRef = useRef<L.Marker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker) {
          setPosition(marker.getLatLng());
          setLocation(marker.getLatLng());
        }
      },
    }),
    [setLocation]
  );
  return (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
      icon={markerIcon}
    />
  );
};

const MapForm: FC<MapFormProps> = ({ updateFields, location }) => {
  const [geoData, setGeoData] = useState(new L.LatLng(location.latitude, location.longitude));
  const [saved, setSaved] = useState(location.saved);
  const { notFound, isLoading } = useLocation(
    `${location.country} ${location.city} ${location.address}`,
    (d) => d && setGeoData(new L.LatLng(d.lat, d.lon)),
    [location.saved]
  );
  if (isLoading) return <Spinner />;

  return (
    <div>
      {notFound
        ? "The given location is not found. Go back and fix the location data"
        : JSON.stringify(geoData)}
      <MapContainer center={geoData} zoom={17} style={{ height: "50vh" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <DraggableMarker
          center={geoData}
          r={100}
          setLocation={(l) => {
            setSaved(false);
            setGeoData(l);
          }}
        />
        {/* <Circle center={geoData} radius={100}></Circle> */}
      </MapContainer>
      <p>
        <input
          type="radio"
          checked={saved}
          onChange={() =>
            updateFields({
              location: { ...location, latitude: geoData.lat, longitude: geoData.lng, saved: true },
            })
          }
          className="cursor-pointer"
          name="saved"
          required
        />
        <span className="ml-2">This is the right location</span>
      </p>
    </div>
  );
};

export default MapForm;
