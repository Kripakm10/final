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
import { ErrorOutline } from '@mui/icons-material';

const ReportNotResolvedModal = ({ open, onClose, item, onReport }) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

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
      <DialogTitle sx={{ fontWeight: 900, pb: 0, fontSize: "1.5rem", display: "flex", alignItems: "center", gap: 1.5 }}>
        <ErrorOutline color="error" /> Report Water Issue
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        <Stack spacing={3}>
          {item && (
            <Box sx={{ p: 2.5, bgcolor: alpha(theme.palette.error.main, 0.05), borderRadius: 4, border: "1px solid", borderColor: alpha(theme.palette.error.main, 0.1) }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "error.main", mb: 1 }}>PENDING WATER SERVICE</Typography>
              <Typography variant="body1" sx={{ fontWeight: 700 }}>{item.issueType}</Typography>
              <Typography variant="body2" color="text.secondary">{item.address}</Typography>
              <Typography variant="caption" sx={{ mt: 1, display: "block", fontWeight: 700, color: "error.main" }}>
                Resolution Missed: {new Date(item.scheduledTime).toLocaleString()}
              </Typography>
            </Box>
          )}

          {error && <Alert severity="error" sx={{ borderRadius: 3 }}>{error}</Alert>}

          <TextField
            label="Incident Details"
            placeholder="Please describe why the water issue remains unresolved..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            multiline
            rows={4}
            fullWidth
            disabled={loading}
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
          onClick={handleReport}
          variant="contained"
          color="error"
          disabled={loading}
          sx={{
            borderRadius: 50,
            fontWeight: 800,
            textTransform: "none",
            px: 4,
            boxShadow: `0 8px 25px ${alpha(theme.palette.error.main, 0.4)}`
          }}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportNotResolvedModal;
