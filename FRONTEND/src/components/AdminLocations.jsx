import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Chip,
  Stack,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import SearchIcon from '@mui/icons-material/Search';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import API_BASE_URL from '../config/api';

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
        box-shadow: ${isHighlighted ? '0 4px 12px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.1)'};
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

const AdminLocations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const mapRef = useRef(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [wRes, waRes, gRes, rRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/waste`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE_URL}/api/water`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE_URL}/api/grievance`, { headers: getAuthHeaders() }),
          fetch(`${API_BASE_URL}/api/registrations`, { headers: getAuthHeaders() }),
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
    <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>
          Live Map
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualizing resource distribution and reported issues across the city.
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 6,
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "#fff",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.1),
          }}
        >
          {items.length > 0 && (
            <>
              <TextField
                fullWidth
                placeholder="Search by name, address, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": { borderRadius: 4 }
                }}
              />

              {/* Legend and Stats */}
              <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Chip
                  label={`All: ${filteredItems.length}`}
                  sx={{ borderRadius: 2, fontWeight: 'bold' }}
                />
                {typeCount.waste > 0 && <Chip label={`Waste: ${typeCount.waste}`} sx={{ bgcolor: alpha('#FF6B6B', 0.1), color: '#FF6B6B', fontWeight: 'bold', border: "1px solid", borderColor: '#FF6B6B' }} />}
                {typeCount.water > 0 && <Chip label={`Water: ${typeCount.water}`} sx={{ bgcolor: alpha('#4ECDC4', 0.1), color: '#4ECDC4', fontWeight: 'bold', border: "1px solid", borderColor: '#4ECDC4' }} />}
                {typeCount.grievance > 0 && <Chip label={`Grievance: ${typeCount.grievance}`} sx={{ bgcolor: alpha('#FFD93D', 0.1), color: isDark ? '#FFD93D' : '#d4ac0d', fontWeight: 'bold', border: "1px solid", borderColor: '#FFD93D' }} />}
                {typeCount.registration > 0 && <Chip label={`Reg: ${typeCount.registration}`} sx={{ bgcolor: alpha('#95E1D3', 0.1), color: isDark ? '#95E1D3' : '#0e6655', fontWeight: 'bold', border: "1px solid", borderColor: '#95E1D3' }} />}
              </Stack>
            </>
          )}

          {filteredItems.length ? (
            <Box sx={{ position: 'relative', height: 500, borderRadius: 4, overflow: 'hidden' }}>
              <MapContainer
                ref={mapRef}
                center={center}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {items.map(it => {
                  const isMatched = filteredItems.some(fi => fi._id === it._id);
                  return (
                    <Marker
                      key={it._id}
                      position={[it.location.lat, it.location.lng]}
                      icon={getMarkerIcon(it.type, isMatched)}
                    >
                      <Popup>
                        <Box sx={{ minWidth: 200, p: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main", textTransform: 'uppercase', mb: 1 }}>
                            {it.type}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Name:</strong> {it.name || (it.firstName && `${it.firstName} ${it.lastName}`) || 'N/A'}
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 0.5 }}>
                            <strong>Address:</strong> {it.address || it.email || 'N/A'}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                            📍 {it.location.lat.toFixed(4)}, {it.location.lng.toFixed(4)}
                          </Typography>
                        </Box>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </Box>
          ) : (
            <Box sx={{ py: 10, textAlign: 'center' }}>
              <Typography color="text.secondary">
                {items.length > 0 ? `No results for "${searchQuery}"` : "No locations available."}
              </Typography>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdminLocations;
