import { useQuery } from "@tanstack/react-query";
import { fetchLocation } from "../api/locations/locations";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import { useState } from "react";
import VisitModal from "../components/VisitModal";
import type { Location } from "../types/location";


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

function MapPage() {
  const { data: locations, isLoading, isError } = useQuery<Location[]>({
    queryKey: ["coords"],
    queryFn: fetchLocation,
  });

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  if (isLoading) return <h1>Loading...</h1>;
  if (isError || !locations) return <h1>Cannot load data, try again later</h1>;

  return (
    <>
      <MapContainer
        className="w-full h-[90vh]"
        center={[50.9006364, 34.7318135]}
        zoom={10}
        maxZoom={19}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <MarkerClusterGroup>
          {locations.map((location) => {
            const [lat, lng] = location.geoTag.split(',').map(Number);

            return (
              <Marker key={location.id} position={[lat, lng]}>
                <Popup>
                  <h3 className="text-xl font-bold">{location.name}</h3>
                  <p className="text-[15px] text-[#333]/70">{location.description}</p>
                  <button
                    onClick={() => {
                      setSelectedLocation(location);
                      setIsOpenModal(true);
                    }}
                    className="text-blue-800 underline mt-2"
                  >
                    Поділитися враженнями
                  </button>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
      </MapContainer>

      {isOpenModal && selectedLocation && (
        <VisitModal
          location={selectedLocation}
          onClose={() => {
            setIsOpenModal(false);
            setSelectedLocation(null);
          }}
        />
      )}
    </>
  );
}

export default MapPage;
