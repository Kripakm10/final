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
  Stack,
  Typography,
  Box,
  alpha,
  useTheme
} from '@mui/material';
import { CalendarMonth, AccessTime } from '@mui/icons-material';

const ScheduleModal = ({ open, onClose, item, onSchedule, endpoint = 'waste' }) => {
  const [scheduledTime, setScheduledTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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

  const now = new Date();
  const minDateTime = now.toISOString().slice(0, 16);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 8,
          bgcolor: isDark ? alpha(theme.palette.background.paper, 0.9) : alpha("#fff", 0.9),
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, pb: 0, fontSize: "1.5rem" }}>
        Assign Schedule
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {item && (
            <Box sx={{ p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 4 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "primary.main", mb: 1 }}>SERVICE RECIPIENT</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{item.name}</Typography>
              <Typography variant="body2" color="text.secondary">{item.address}</Typography>
              <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                <Typography variant="caption" sx={{ px: 1.5, py: 0.5, bgcolor: alpha(theme.palette.primary.main, 0.1), borderRadius: 50, fontWeight: 700 }}>
                  {item.wasteType || item.issueType}
                </Typography>
              </Box>
            </Box>
          )}

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

          <TextField
            label="Planned Completion Date & Time"
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            inputProps={{ min: minDateTime }}
            fullWidth
            disabled={loading}
            InputLabelProps={{ shrink: true }}
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{ borderRadius: 50, fontWeight: 700, textTransform: "none", px: 3 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSchedule}
          variant="contained"
          disabled={loading}
          sx={{
            borderRadius: 50,
            fontWeight: 800,
            textTransform: "none",
            px: 4,
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CalendarMonth />}
        >
          {loading ? 'Processing...' : 'Schedule Task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScheduleModal;
