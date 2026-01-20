import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Avatar, Stack , Grid, Chip, Alert } from '@mui/material';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import ReportNotCollectedModal from './ReportNotCollectedModal';
import ReportNotResolvedModal from './ReportNotResolvedModal';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [wastes, setWastes] = useState([]);
  const [waters, setWaters] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [reportWaterModalOpen, setReportWaterModalOpen] = useState(false);
  const [selectedWater, setSelectedWater] = useState(null);

  const statusColor = (s) => {
    if (!s) return 'red';
    const st = String(s).toLowerCase();
    if (st === 'collected' || st === 'resolved' || st === 'approved') return 'green';
    if (st === 'pending' || st === 'open' || st === 'rejected') return 'red';
    if (st === 'in-progress' || st === 'in progress') return 'orange';
    return 'inherit';
  };
  
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user');
    const storedToken = sessionStorage.getItem('token');

    console.log("Session Storage User:", storedUser); // Debugging

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        if (storedToken) {
            fetchMine(storedToken);
        }
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    } else {
        navigate('/login');
    }
  }, []);

  const authHeaders = (token) => {
    return { 
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
    };
  };

  const fetchMine = async (token) => {
    try {
      setLoading(true);
      const headers = authHeaders(token);

      const [w, wa, g] = await Promise.all([
        fetch('http://localhost:3000/api/waste/mine', { headers }),
        fetch('http://localhost:3000/api/water/mine', { headers }),
        fetch('http://localhost:3000/api/grievance/mine', { headers }),
      ]);

      if (w.ok) {
        const wasteData = await w.json();
        setWastes(wasteData);
      }
      if (wa.ok) {
        const waterData = await wa.json();
        setWaters(waterData);
      }
      if (g.ok) {
        const grievanceData = await g.json();
        setGrievances(grievanceData);
      }
    } catch (err) {
      console.error('fetch mine error', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear(); 
    setUser(null);
    navigate('/login'); 
  };

  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 4, mt: 8 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4" color="primary">My Dashboard</Typography>
            {user && (
                <Button variant="outlined" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            )}
        </Stack>

        {user ? (
          <Paper sx={{ p: 3, mb: 4, bgcolor: '#F6F7FA' }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ bgcolor: '#0a4572ff', width: 56, height: 56 }}>
                {(user.fullName || user.email || 'U')[0].toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h5">{user.fullName}</Typography>
                <Typography variant="body1" color="text.secondary">{user.email}</Typography>
                <Typography variant="caption" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                    {user.role || 'User'}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ) : (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography>Please login to view your dashboard.</Typography>
          </Paper>
        )}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #7AA2C1', display:'inline-block' }}>
                My Waste Requests
              </Typography>
              {wastes.length ? wastes.map((w, i) => {
                const isScheduled = w.status === 'scheduled' && w.scheduledTime;
                const scheduledDate = isScheduled ? new Date(w.scheduledTime) : null;
                const isPast = scheduledDate && new Date() > scheduledDate;
                const canReport = isPast && (w.status === 'scheduled' || w.status === 'not-collected');
                
                return (
                  <Paper key={w._id || i} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafaff' }}>
                    <Typography variant="subtitle1" fontWeight="bold">{w.wasteType || 'Waste Collection'}</Typography>
                    <Typography variant="body2">{w.address}</Typography>
                    
                    {isScheduled && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          📅 Scheduled: {scheduledDate.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    
                    {w.reports && w.reports.length > 0 && (
                      <Alert severity="warning" sx={{ mt: 1, py: 0.5 }}>
                        {w.reports.length} report(s) submitted - Status: {w.status}
                      </Alert>
                    )}
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
                      <Chip 
                        label={w.status || 'Pending'} 
                        size="small"
                        color={w.status === 'collected' ? 'success' : w.status === 'not-collected' ? 'error' : 'default'}
                        variant="outlined"
                      />
                      {canReport && (
                        <Button 
                          size="small" 
                          color="error"
                          variant="outlined"
                          onClick={() => {
                            setSelectedWaste(w);
                            setReportModalOpen(true);
                          }}
                        >
                          Report Not Collected
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                );
              }) : <Typography color="text.secondary">No waste requests yet.</Typography>}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #467ce0ff', display:'inline-block' }}>
                My Water Reports
              </Typography>
              {waters.length ? waters.map((w, i) => {
                const isScheduled = w.status === 'scheduled' && w.scheduledTime;
                const scheduledDate = isScheduled ? new Date(w.scheduledTime) : null;
                const isPast = scheduledDate && new Date() > scheduledDate;
                const canReport = isPast && (w.status === 'scheduled' || w.status === 'not-resolved');
                
                return (
                  <Paper key={w._id || i} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}>
                    <Typography variant="subtitle1" fontWeight="bold">{w.issueType || 'Water Issue'}</Typography>
                    <Typography variant="body2">{w.address}</Typography>
                    {w.location && w.location.lat && (
                      <Typography variant="caption" color="text.secondary" display="block">Location: {w.location.lat.toFixed(5)}, {w.location.lng.toFixed(5)}</Typography>
                    )}
                    
                    {isScheduled && (
                      <Box sx={{ mt: 1, p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                          📅 Scheduled: {scheduledDate.toLocaleString()}
                        </Typography>
                      </Box>
                    )}
                    
                    {w.reports && w.reports.length > 0 && (
                      <Alert severity="warning" sx={{ mt: 1, py: 0.5 }}>
                        {w.reports.length} report(s) submitted - Status: {w.status}
                      </Alert>
                    )}
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
                      <Chip 
                        label={w.status || 'Pending'} 
                        size="small"
                        color={w.status === 'resolved' ? 'success' : w.status === 'not-resolved' ? 'error' : 'default'}
                        variant="outlined"
                      />
                      {canReport && (
                        <Button 
                          size="small" 
                          color="error"
                          variant="outlined"
                          onClick={() => {
                            setSelectedWater(w);
                            setReportWaterModalOpen(true);
                          }}
                        >
                          Report Not Resolved
                        </Button>
                      )}
                    </Stack>
                  </Paper>
                );
              }) : <Typography color="text.secondary">No water reports yet.</Typography>}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #1976d2', display:'inline-block' }}>
                My Grievances
              </Typography>
              {grievances.length ? grievances.map((g, i) => (
                <Paper key={g._id || i} variant="outlined" sx={{ p: 2, mb: 2, bgcolor: '#fafafa' }}>
                  <Typography variant="subtitle1" fontWeight="bold">{g.subject}</Typography>
                  <Typography variant="body2">{g.description}</Typography>
                  {g.location && g.location.lat && (
                    <Typography variant="caption" color="text.secondary" display="block">Location: {g.location.lat.toFixed(5)}, {g.location.lng.toFixed(5)}</Typography>
                  )}
                  <Typography variant="caption" sx={{ color: statusColor(g.status), fontWeight:'bold', mt: 1, display: 'block' }}>
                    Status: {g.status || 'Open'}
                  </Typography>
                </Paper>
              )) : <Typography color="text.secondary">No grievances yet.</Typography>}
            </Paper>
          </Grid>
        </Grid>

        <ReportNotCollectedModal 
          open={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          item={selectedWaste}
          onReport={() => {
            const storedToken = sessionStorage.getItem('token');
            if (storedToken) fetchMine(storedToken);
          }}
        />

        <ReportNotResolvedModal 
          open={reportWaterModalOpen}
          onClose={() => setReportWaterModalOpen(false)}
          item={selectedWater}
          onReport={() => {
            const storedToken = sessionStorage.getItem('token');
            if (storedToken) fetchMine(storedToken);
          }}
        />

      </Box>
    </Box>
  );
};

export default UserDashboard;