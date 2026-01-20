// import React, { useEffect } from 'react';
// import { Box, Typography, Button } from '@mui/material';
// import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// req
// // Fix marker icon references
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png')
// });
import React, { useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix marker icon references
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ClickHandler = ({ setPos }) => {
  useMapEvents({
    click(e) {
      setPos([e.latlng.lat, e.latlng.lng]);
    }
  });
  return null;
};

const LocationPicker = ({ position, setPosition, height = 240 }) => {
  useEffect(() => {
    if (!position && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((p) => {
        setPosition([p.coords.latitude, p.coords.longitude]);
      }, () => {
        setPosition([20.5937, 78.9629]);
      });
    }
  }, []);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>Pick location on map (click to place marker)</Typography>
      {position ? (
        <MapContainer center={position} zoom={13} style={{ height }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <ClickHandler setPos={setPosition} />
          <Marker position={position}>
            <Popup>Selected: {position[0].toFixed(5)}, {position[1].toFixed(5)}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
          <Typography color="text.secondary">Loading map...</Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
        <Button size="small" onClick={() => setPosition(null)}>Reset</Button>
      </Box>
    </Box>
  );
};

export default LocationPicker;
