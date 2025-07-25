import { MapContainer, TileLayer, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  type: 'full' | 'shared' | 'inactive';
}

const MapComponent = () => {
  // Sample data for Africa locations
  const locations: MapLocation[] = [
    { lat: 9.3077, lng: 2.3158, name: 'Benin', type: 'full' },
    { lat: 7.3697, lng: 12.3547, name: 'Cameroon', type: 'shared' },
    { lat: -0.8037, lng: 11.6094, name: 'Gabon', type: 'inactive' },
    { lat: 8.4496, lng: -11.7799, name: 'Sierra Leone', type: 'full' },
    { lat: 9.0820, lng: 8.6753, name: 'Nigeria', type: 'shared' },
    { lat: 1.3733, lng: 32.2903, name: 'Uganda', type: 'shared' },
  ];

  const getMarkerColor = (type: string) => {
    switch(type) {
      case 'full': return '#143F6B';
      case 'shared': return '#3B82F6';
      case 'inactive': return '#FF1E1E';
      default: return '#999999';
    }
  };

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <MapContainer center={[7.3697, 12.3547]} zoom={3} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((location, index) => (
          <CircleMarker
            key={index}
            center={[location.lat, location.lng]}
            radius={6}
            pathOptions={{ 
              fillColor: getMarkerColor(location.type),
              fillOpacity: 0.8,
              weight: 1,
              color: '#fff'
            }}
          >
            <Tooltip permanent>{location.name}</Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
      <div className="flex justify-start gap-4 mt-3 text-sm">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-secondary mr-2"></span>
          <span>licence pleine</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span>licence partagée</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 rounded-full bg-danger mr-2"></span>
          <span>licence désactivée</span>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;