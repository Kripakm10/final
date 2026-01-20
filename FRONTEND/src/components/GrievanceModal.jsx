import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Alert, Box, Typography } from '@mui/material';
import axios from 'axios';
import LocationPicker from './LocationPicker';

const GrievanceModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', description: '', lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setError('');
    if (!formData.name || !formData.subject || !formData.description) return setError('Please fill required fields');
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const payload = { name: formData.name, email: formData.email, subject: formData.subject, description: formData.description };
      if (formData.lat !== null && formData.lng !== null) { payload.lat = Number(formData.lat); payload.lng = Number(formData.lng); }
      const res = await axios.post('http://localhost:3000/api/grievance', payload, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
      onSuccess && onSuccess(res.data);
      setFormData({ name: '', email: '', subject: '', description: '', lat: null, lng: null });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Submission failed');
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Submit Grievance</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'grid', gap: 2, mt: 1 }}>
          <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required />
          <TextField label="Email" name="email" value={formData.email} onChange={handleChange} />
          <TextField label="Subject" name="subject" value={formData.subject} onChange={handleChange} required />
          <TextField label="Description" name="description" value={formData.description} onChange={handleChange} multiline rows={4} required />
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

export default GrievanceModal;
