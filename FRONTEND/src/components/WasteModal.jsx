import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, CircularProgress, Alert, Box, Typography } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import LocationPicker from './LocationPicker';

const WasteModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', address: '', contact: '', wasteType: '', lat: null, lng: null });

  useEffect(() => {
    if (!open) return;
    try {
      const stored = sessionStorage.getItem('user') || localStorage.getItem('user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.fullName) {
          setFormData((s) => ({ ...s, name: parsed.fullName }));
        }
      }
    } catch (err) {
      // ignore parse errors
    }
  }, [open]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    if (!formData.name || !formData.contact || !formData.address) return setError('Please fill required fields');
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const payload = { name: formData.name, address: formData.address, contact: formData.contact, wasteType: formData.wasteType };
      if (formData.lat !== null && formData.lng !== null) { payload.lat = Number(formData.lat); payload.lng = Number(formData.lng); }
      const res = await axios.post(`${API_BASE_URL}/api/waste`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      onSuccess && onSuccess(res.data);
      setFormData({ name: '', address: '', contact: '', wasteType: '', lat: null, lng: null });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Request Waste Collection</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <TextField label="Contact" name="contact" value={formData.contact} onChange={handleChange} required />
          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required />
          <TextField select label="Waste Type" name="wasteType" value={formData.wasteType} onChange={handleChange}>
            <MenuItem value="Municipal Solid Waste">Municipal Solid Waste</MenuItem>
            <MenuItem value="Biomedical Waste">Biomedical Waste</MenuItem>
            <MenuItem value="E-Waste">E-Waste</MenuItem>
            <MenuItem value="Plastic Waste">Plastic Waste</MenuItem>
          </TextField>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <LocationPicker position={formData.lat && formData.lng ? [formData.lat, formData.lng] : null} setPosition={(pos) => setFormData((s) => ({ ...s, lat: pos ? pos[0] : null, lng: pos ? pos[1] : null }))} />
        <Box sx={{ mt: 1 }}>
          {formData.lat && formData.lng && (
            <Typography variant="body2" color="text.secondary">Selected: {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}</Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading}> {loading ? <CircularProgress size={18} color="inherit"/> : 'Submit'} </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WasteModal;