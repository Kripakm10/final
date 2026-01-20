import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Paper, TextField, InputAdornment, Chip, Stack, List, ListItem, ListItemButton, ListItemText, CircularProgress } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Create custom colored markers for different types
const getMarkerIcon = (type, isHighlighted = true) => {
  const colors = {
    waste: '#FF6B6B',
    water: '#4ECDC4',
    grievance: '#FFD93D',
    registration: '#95E1D3'
  };
  
  const color = colors[type] || '#009688';
  const opacity = isHighlighted ? 1 : 0.4;
  const scale = isHighlighted ? 1 : 0.8;
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        opacity: ${opacity};
        width: ${32 * scale}px;
        height: ${32 * scale}px;
        border-radius: 50%;
        border: ${3 * scale}px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: ${isHighlighted ? '0 2px 8px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.2)'};
        font-weight: bold;
        color: white;
        font-size: ${12 * scale}px;
        transition: all 0.2s;
      ">
        ${type.charAt(0).toUpperCase()}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32 * scale, 32 * scale],
    iconAnchor: [16 * scale, 16 * scale],
    popupAnchor: [0, -16 * scale]
  });
};

// Blue location pin icon
const blueLocationIcon = L.divIcon({
  html: `
    <div style="
      color: #2196F3;
      font-size: 32px;
      text-shadow: 0 1px 3px rgba(0,0,0,0.3);
    ">
      📍
    </div>
  `,
  className: 'blue-location-marker',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const AdminLocations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapRef = useRef(null);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [wRes, waRes, gRes, rRes] = await Promise.all([
          fetch('http://localhost:3000/api/waste', { headers: getAuthHeaders() }),
          fetch('http://localhost:3000/api/water', { headers: getAuthHeaders() }),
          fetch('http://localhost:3000/api/grievance', { headers: getAuthHeaders() }),
          fetch('http://localhost:3000/api/registrations', { headers: getAuthHeaders() }),
        ]);

        const [waste, water, grievance, regs] = await Promise.all([
          wRes.json(),
          waRes.json(),
          gRes.json(),
          rRes.json(),
        ]);

        const combined = [];
        waste.forEach(i => i.location && combined.push({ ...i, type: 'waste' }));
        water.forEach(i => i.location && combined.push({ ...i, type: 'water' }));
        grievance.forEach(i => i.location && combined.push({ ...i, type: 'grievance' }));
        regs.forEach(i => i.location && combined.push({ ...i, type: 'registration' }));

        setItems(combined);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems(items);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = items.filter(item => {
        const name = (item.name || 
          (item.firstName && `${item.firstName} ${item.lastName}`) || 
          '').toLowerCase();
        const address = (item.address || '').toLowerCase();
        const email = (item.email || '').toLowerCase();
        const type = (item.type || '').toLowerCase();
        const phone = (item.phone || item.phoneNumber || '').toLowerCase();
        
        return (
          name.includes(query) ||
          address.includes(query) ||
          email.includes(query) ||
          type.includes(query) ||
          phone.includes(query)
        );
      });
      setFilteredItems(filtered);
    }
  }, [searchQuery, items]);

  // Auto-fit map to show all filtered markers
  useEffect(() => {
    if (mapRef.current && filteredItems.length > 0) {
      const bounds = L.latLngBounds(
        filteredItems.map(item => [item.location.lat, item.location.lng])
      );
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [filteredItems]);

  const center = filteredItems.length
    ? [filteredItems[0].location.lat, filteredItems[0].location.lng]
    : (items.length
        ? [items[0].location.lat, items[0].location.lng]
        : [20.5937, 78.9629]);

  // Count by type
  const typeCount = {
    waste: filteredItems.filter(i => i.type === 'waste').length,
    water: filteredItems.filter(i => i.type === 'water').length,
    grievance: filteredItems.filter(i => i.type === 'grievance').length,
    registration: filteredItems.filter(i => i.type === 'registration').length,
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Submitted Locations
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <Paper sx={{ p: 2 }}>
          {items.length > 0 && (
            <>
              <TextField
                fullWidth
                placeholder="Search by name, address, email, phone, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
                size="small"
              />

              {/* Legend and Stats */}
              <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
                <Chip label={`📍 All Locations: ${filteredItems.length}/${items.length}`} color="default" />
                {typeCount.waste > 0 && <Chip label={`🗑️ Waste: ${typeCount.waste}`} sx={{ bgcolor: '#FF6B6B', color: 'white' }} />}
                {typeCount.water > 0 && <Chip label={`💧 Water: ${typeCount.water}`} sx={{ bgcolor: '#4ECDC4', color: 'white' }} />}
                {typeCount.grievance > 0 && <Chip label={`⚠️ Grievance: ${typeCount.grievance}`} sx={{ bgcolor: '#FFD93D', color: 'black' }} />}
                {typeCount.registration > 0 && <Chip label={`✓ Registration: ${typeCount.registration}`} sx={{ bgcolor: '#95E1D3', color: 'black' }} />}
              </Stack>
            </>
          )}

          {filteredItems.length ? (
            <>
              <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                Showing {filteredItems.length} of {items.length} locations
                {searchQuery && ` (filtered by: "${searchQuery}")`}
              </Typography>
              <MapContainer 
                ref={mapRef}
                center={center} 
                zoom={12} 
                style={{ height: 500, borderRadius: '4px' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {/* Show all locations, but highlight filtered ones */}
                {items.map(it => {
                  const isMatched = filteredItems.some(fi => fi._id === it._id);
                  return (
                    <Marker
                      key={it._id}
                      position={[it.location.lat, it.location.lng]}
                      icon={getMarkerIcon(it.type, isMatched)}
                    >
                      <Popup>
                        <Box sx={{ minWidth: 200 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#009688' }}>
                            {it.type.toUpperCase()}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            <strong>Name:</strong> {it.name ||
                              (it.firstName && `${it.firstName} ${it.lastName}`) ||
                              'No name'}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.3 }}>
                            <strong>Address:</strong> {it.address || it.email || 'N/A'}
                          </Typography>
                          {it.phone && (
                            <Typography variant="body2" sx={{ mt: 0.3 }}>
                              <strong>Phone:</strong> {it.phone}
                            </Typography>
                          )}
                          <Typography variant="body2" sx={{ mt: 0.3, color: 'text.secondary' }}>
                            📍 {it.location.lat.toFixed(5)}, {it.location.lng.toFixed(5)}
                          </Typography>
                        </Box>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </>
          ) : items.length > 0 ? (
            <Typography color="text.secondary">
              No locations match your search "{searchQuery}".
            </Typography>
          ) : (
            <Typography color="text.secondary">
              No locations submitted yet.
            </Typography>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdminLocations;
