import React, { useState } from 'react';
import API_BASE_URL from '../config/api';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';

const ScheduleModal = ({ open, onClose, item, onSchedule, endpoint = 'waste' }) => {
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!scheduledTime) {
      setError('Please select a date and time');
      return;
    }

    const selectedDate = new Date(scheduledTime);
    const now = new Date();

    if (selectedDate <= now) {
      setError('Please select a future date and time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = sessionStorage.getItem('token') || localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const response = await fetch(`${API_BASE_URL}/api/${endpoint}/${item._id}/schedule`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ scheduledTime })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to schedule');
        return;
      }

      onSchedule();
      setScheduledTime('');
      onClose();
    } catch (err) {
      console.error('Schedule error:', err);
      setError('An error occurred while scheduling');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setScheduledTime('');
    setError('');
    onClose();
  };

  // Get minimum datetime (now)
  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Schedule Waste Collection</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {item && (
            <>
              <div>
                <strong>Name:</strong> {item.name}
              </div>
              <div>
                <strong>Address:</strong> {item.address}
              </div>
              <div>
                <strong>Type:</strong> {item.wasteType}
              </div>
            </>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Schedule Date & Time"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            inputProps={{ min: minDateTime }}
            fullWidth
            disabled={loading}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={handleSchedule}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Scheduling...' : 'Schedule'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleModal;
