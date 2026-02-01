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
  Typography
} from '@mui/material';

const ReportNotResolvedModal = ({ open, onClose, item, onReport }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReport = async () => {
    if (!reason.trim()) {
      setError('Please provide a reason for reporting');
      return;
    }

    if (reason.trim().length < 10) {
      setError('Please provide a detailed reason (at least 10 characters)');
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

      const response = await fetch(`${API_BASE_URL}/api/water/${item._id}/report`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ reason })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || 'Failed to submit report');
        return;
      }

      onReport();
      setReason('');
      onClose();
    } catch (err) {
      console.error('Report error:', err);
      setError('An error occurred while submitting your report');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Not Resolved</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {item && (
            <>
              <div>
                <strong>Issue Type:</strong> {item.issueType}
              </div>
              <div>
                <strong>Address:</strong> {item.address}
              </div>
              <div>
                <strong>Scheduled for:</strong> {new Date(item.scheduledTime).toLocaleString()}
              </div>
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Status: Water issue was not resolved on the scheduled time
              </Typography>
            </>
          )}
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Reason for Report"
            placeholder="Describe why the water issue was not resolved..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={4}
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
          onClick={handleReport}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportNotResolvedModal;
