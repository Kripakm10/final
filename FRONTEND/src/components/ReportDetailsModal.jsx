import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Chip,
  Paper,
  Box
} from '@mui/material';

const ReportDetailsModal = ({ open, onClose, item }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Not Collected Reports</DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={2}>
          {item && (
            <>
              <div>
                <strong>Item:</strong> {item.name}
              </div>
              <div>
                <strong>Address:</strong> {item.address}
              </div>
              <div>
                <strong>Type:</strong> {item.wasteType}
              </div>
              <div>
                <strong>Scheduled:</strong> {new Date(item.scheduledTime).toLocaleString()}
              </div>
              <div>
                <strong>Status:</strong> <Chip label={item.status} size="small" color="error" />
              </div>
              <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                Reports ({item.reports?.length || 0})
              </Typography>
              
              {item.reports && item.reports.length > 0 ? (
                <Stack spacing={2}>
                  {item.reports.map((report, idx) => (
                    <Paper key={idx} sx={{ p: 2, bgcolor: '#fff3cd', borderLeft: '4px solid #ff9800' }}>
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="subtitle2" fontWeight="bold">
                            Report #{idx + 1}
                          </Typography>
                          <Chip 
                            label={report.status || 'pending'} 
                            size="small"
                            color={report.status === 'resolved' ? 'success' : report.status === 'acknowledged' ? 'warning' : 'default'}
                          />
                        </Box>
                        <Typography variant="caption" color="text.secondary">
                          Reported: {new Date(report.reportedAt).toLocaleString()}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Reason:</strong> {report.reason}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography color="text.secondary">No reports yet</Typography>
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReportDetailsModal;
