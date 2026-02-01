import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, CircularProgress, Alert } from '@mui/material';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import LocationPicker from './LocationPicker';
import { Typography } from '@mui/material';

const RegistrationModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', department: '', subOption: '', lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    if (!formData.firstName || !formData.email || !formData.phone) return setError('Please fill required fields');
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const payload = { firstName: formData.firstName, lastName: formData.lastName, email: formData.email, phone: formData.phone, department: formData.department, subOption: formData.subOption };
      if (formData.lat !== null && formData.lng !== null) { payload.lat = Number(formData.lat); payload.lng = Number(formData.lng); }
      const res = await axios.post(`${API_BASE_URL}/api/registrations`, payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      onSuccess && onSuccess(res.data);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', department: '', subOption: '', lat: null, lng: null });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Register for Services</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
          <TextField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} required />
          <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
          <FormControl>
            <InputLabel id="department-modal">Department</InputLabel>
            <Select labelId="department-modal" name="department" value={formData.department} onChange={handleChange}>
              <MenuItem value="Waste Management">Waste Management</MenuItem>
              <MenuItem value="Water Supply Management">Water Supply Management</MenuItem>
            </Select>
          </FormControl>
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
        <Button variant="contained" onClick={handleSubmit} disabled={loading}>{loading ? <CircularProgress size={18} color="inherit"/> : 'Submit'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegistrationModal;
