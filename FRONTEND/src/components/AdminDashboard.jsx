import React, { useEffect, useState } from "react";
import {
  Box,
  CssBaseline,
  Typography,
  createTheme,
  ThemeProvider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Select,
  MenuItem,
  Button,
  Avatar,
  Divider,
  Grid,
} from "@mui/material";
import {
  Dashboard,
  DeleteOutline,
  Opacity,
  ReportProblem,
  People,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import Navbar from "./Navbar";
import AdminLocations from './AdminLocations';
import ScheduleModal from './ScheduleModal';
import ReportDetailsModal from './ReportDetailsModal';

// 🎨 Theme
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#009688" }, // Teal
    secondary: { main: "#ff7043" }, // Coral
    background: { default: "#f0f4f8" },
  },
  typography: { fontFamily: "Roboto, sans-serif" },
});

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState('overview');
  
  // Data States
  const [wastes, setWastes] = useState([]);
  const [waters, setWaters] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [userLogins, setUserLogins] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  // derived
  const selectedUserObj = users.find(u => u._id === selectedUser) || null;
  const selectedUserLogins = userLogins.filter(l => {
    if (selectedUser === 'all') return true;
    if (l.createdBy && l.createdBy._id) return l.createdBy._id === selectedUser;
    if (l.meta && l.meta.email && selectedUserObj) return l.meta.email === selectedUserObj.email;
    return false;
  });
  const lastLogin = selectedUserLogins
    .filter(l => l.action === 'login')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const failedCount = selectedUserLogins.filter(l => l.action === 'login_failed').length;
  
  // Loading & Overview States
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({ 
    wasteCount: 0, 
    registrationCount: 0, 
    userCount: 0, 
    recentWastes: [], 
    recentRegs: [], 
    recentLogs: [] 
  });
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedWater, setSelectedWater] = useState(null);
  const [waterScheduleModalOpen, setWaterScheduleModalOpen] = useState(false);

  const navigate = useNavigate();
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // 🔹 Helper: Get Headers from Session Storage
  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  // 🔹 Helper: Handle Unauthorized Access
  const handleAuthError = (res) => {
    if (res.status === 401 || res.status === 403) {
      alert('Session expired or unauthorized. Please login again.');
      sessionStorage.clear();
      navigate('/login');
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (tab === 'waste') fetchWastes();
    if (tab === 'water') fetchWaters();
    if (tab === 'grievances') fetchGrievances();
    if (tab === 'registrations') fetchRegistrations();
    if (tab === 'logs') fetchLogs();
    if (tab === 'userlogins') {
      fetchUserLogins();
      fetchUsers();
    }
    if (tab === 'overview') fetchOverview();
  }, [tab]);

  // --- API CALLS ---

  const fetchOverview = async () => {
    try {
      setOverviewLoading(true);
      const headers = getAuthHeaders();
      
      const [wRes, rRes, uRes, lRes] = await Promise.all([
        fetch('http://localhost:3000/api/waste', { headers }),
        fetch('http://localhost:3000/api/registrations', { headers }),
        fetch('http://localhost:3000/api/users', { headers }),
        fetch('http://localhost:3000/api/logs', { headers }),
      ]);

      if (handleAuthError(wRes)) return;

      const [wData, rData, uData, lData] = await Promise.all([wRes.json(), rRes.json(), uRes.json(), lRes.json()]);

      setOverview({
        wasteCount: wData.length || 0,
        registrationCount: rData.length || 0,
        userCount: uData.length || 0,
        recentWastes: wData.slice(0, 5),
        recentRegs: rData.slice(0, 5),
        recentLogs: lData.slice(0, 8),
      });
    } catch (err) {
      console.error('fetch overview', err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchWastes = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/waste', { headers: getAuthHeaders() });
      if (handleAuthError(res)) return;
      const data = await res.json();
      setWastes(data);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchWaters = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/water', { headers: getAuthHeaders() });
      if (handleAuthError(res)) return;
      setWaters(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/grievance', { headers: getAuthHeaders() });
      if (handleAuthError(res)) return;
      setGrievances(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/registrations', { headers: getAuthHeaders() });
      if (handleAuthError(res)) return;
      setRegistrations(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/logs', { headers: getAuthHeaders() });
      if (handleAuthError(res)) return;
      setLogs(await res.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchUserLogins = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/logs', { headers: getAuthHeaders() });
      if (handleAuthError(res)) return;
      const all = await res.json();
      const logins = all.filter(l => l.action === 'login' || l.action === 'login_failed');
      setUserLogins(logins);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:3000/api/users', { headers: getAuthHeaders() });
      if (handleAuthError(res)) return;
      const data = await res.json();
      setUsers(data || []);
    } catch (err) { console.error('fetchUsers', err); } finally { setLoading(false); }
  };

  // --- ACTIONS ---

  const updateStatus = async (endpoint, id, status, refresh) => {
    try {
      await fetch(`http://localhost:3000/api/${endpoint}/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      refresh();
    } catch (err) { console.error(err); }
  };

  const deleteItem = async (endpoint, id, refresh) => {
    if(!window.confirm("Are you sure?")) return;
    try {
      await fetch(`http://localhost:3000/api/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      refresh();
    } catch (err) { console.error(err); }
  };

  const drawer = (
    <Box sx={{ bgcolor: "#fff", height: "100%" }}>
      <Typography variant="h5" color="primary" sx={{ p: 2, fontWeight: "bold", textAlign: "center", mt: 2 }}>
        Admin Panel
      </Typography>
      <Divider />
      <List>
        {[
          { key: 'overview', text: "Dashboard Overview", icon: <Dashboard /> },
          { key: 'waste', text: "Waste Management", icon: <DeleteOutline /> },
          { key: 'water', text: "Water Issues", icon: <Opacity /> },
          { key: 'grievances', text: "Grievances", icon: <ReportProblem /> },
          { key: 'locations', text: "Locations", icon: <Dashboard /> },
          { key: 'userlogins', text: "User Logins", icon: <People /> },
          { key: 'logs', text: "Activity Logs", icon: <ReportProblem /> },
        ].map((item) => (
          <ListItem key={item.key} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
                onClick={() => setTab(item.key)} 
                selected={tab === item.key}
                sx={{ 
                    "&.Mui-selected": { bgcolor: "rgba(0,150,136,0.1)", borderLeft: "4px solid #009688" },
                    "&:hover": { bgcolor: "rgba(0,150,136,0.05)" }
                }}
            >
              <ListItemIcon sx={{ color: tab === item.key ? "#009688" : "inherit" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{ color: tab === item.key ? "#009688" : "inherit" }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      <Box sx={{ display: "flex" }}>
        
        {/* 🔹 Sidebar Drawer */}
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
          {/* Mobile */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth, top: '64px', height: 'calc(100% - 64px)' },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* 🔹 Main Content */}
        <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, mt: 8 }}>
          
          {tab === 'overview' && (
            <>
              <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold', mb: 3 }}>Dashboard Overview</Typography>

              {/* ✅ Grid v2 Syntax */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {[
                  { title: 'Waste Requests', value: overview.wasteCount, color: '#009688', icon: <DeleteOutline /> , link: 'waste'},
                  { title: 'Activity Logs', value: overview.recentLogs?.length, color: '#ff7043', icon: <ReportProblem />, link: 'logs'},
                ].map((stat, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
                    <Paper elevation={2} sx={{ p: 2.5, borderRadius: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: stat.color, width: 56, height: 56 }}>{stat.icon}</Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>{stat.title}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{stat.value}</Typography>
                        <Button size="small" onClick={() => setTab(stat.link)}>View Details</Button>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                      <Typography variant="h6">Recent Activity</Typography>
                      <Button size="small" onClick={() => setTab('logs')}>See all</Button>
                    </Stack>
                    <Box>
                      {overviewLoading ? <Typography>Loading...</Typography> : (
                        (overview.recentLogs && overview.recentLogs.length > 0) ? overview.recentLogs.map((l, i) => (
                          <Paper key={i} variant="outlined" sx={{ p: 1, mb: 1, bgcolor: '#fafafa' }}>
                            <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>
                                <strong>{l.action}</strong>: {l.message} <br/>
                                <span style={{color: 'gray', fontSize:'0.75rem'}}>{new Date(l.createdAt).toLocaleString()}</span>
                            </Typography>
                          </Paper>
                        )) : <Typography color="text.secondary">No recent activity</Typography>
                      )}
                    </Box>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Recent Requests</Typography>
                    {overviewLoading ? <Typography>Loading...</Typography> : (
                        overview.recentWastes.length ? overview.recentWastes.map((w, i) => (
                            <Box key={i} sx={{ mb: 1, pb: 1, borderBottom: '1px solid #eee' }}>
                                <Typography variant="subtitle2">{w.wasteType}</Typography>
                                <Typography variant="caption" color="text.secondary">{w.address} • {w.status}</Typography>
                            </Box>
                        )) : <Typography color="text.secondary">No recent requests</Typography>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

          {tab === 'waste' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Waste Requests</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                {loading ? <Typography>Loading...</Typography> : (
                  <Grid container spacing={2}>
                    {wastes.map(w => (
                      <Grid size={{ xs: 12, md: 6 }} key={w._id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="h6">{w.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{w.address}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {w.wasteType} • {w.status || 'Pending'}
                          </Typography>
                          {w.scheduledTime && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'info.main' }}>
                              📅 Scheduled: {new Date(w.scheduledTime).toLocaleString()}
                            </Typography>
                          )}
                          {w.reports && w.reports.length > 0 && (
                            <Button 
                              size="small" 
                              color="error"
                              onClick={() => {
                                setSelectedWaste(w);
                                setReportModalOpen(true);
                              }}
                            >
                              📋 View {w.reports.length} Report(s)
                            </Button>
                          )}
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            {w.status !== 'collected' && (
                              <>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  onClick={() => {
                                    setSelectedWaste(w);
                                    setScheduleModalOpen(true);
                                  }}
                                >
                                  {w.status === 'scheduled' ? 'Reschedule' : 'Schedule'}
                                </Button>
                                <Button size="small" variant="outlined" onClick={() => updateStatus('waste', w._id, 'collected', fetchWastes)}>Collected</Button>
                              </>
                            )}
                            {w.status === 'collected' && (
                              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                ✓ Collected
                              </Typography>
                            )}
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
              <ScheduleModal 
                open={scheduleModalOpen} 
                onClose={() => setScheduleModalOpen(false)}
                item={selectedWaste}
                onSchedule={fetchWastes}
              />
              <ReportDetailsModal 
                open={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                item={selectedWaste}
              />
            </>
          )}

          {tab === 'water' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Water Requests</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                {loading ? <Typography>Loading...</Typography> : (
                  <Grid container spacing={2}>
                    {waters.map(w => (
                      <Grid size={{ xs: 12, md: 6 }} key={w._id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="h6">{w.name}</Typography>
                          <Typography variant="body2" color="text.secondary">{w.address}</Typography>
                          <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                            {w.issueType} • {w.status || 'Pending'}
                          </Typography>
                          {w.scheduledTime && (
                            <Typography variant="body2" sx={{ mt: 1, color: 'info.main' }}>
                              📅 Scheduled: {new Date(w.scheduledTime).toLocaleString()}
                            </Typography>
                          )}
                          {w.reports && w.reports.length > 0 && (
                            <Button 
                              size="small" 
                              color="error"
                              onClick={() => {
                                setSelectedWater(w);
                                setReportModalOpen(true);
                              }}
                            >
                              📋 View {w.reports.length} Report(s)
                            </Button>
                          )}
                          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            {w.status !== 'resolved' && (
                              <>
                                <Button 
                                  size="small" 
                                  variant="contained" 
                                  onClick={() => {
                                    setSelectedWater(w);
                                    setWaterScheduleModalOpen(true);
                                  }}
                                >
                                  {w.status === 'scheduled' ? 'Reschedule' : 'Schedule'}
                                </Button>
                                <Button size="small" variant="outlined" onClick={() => updateStatus('water', w._id, 'resolved', fetchWaters)}>Resolve</Button>
                              </>
                            )}
                            {w.status === 'resolved' && (
                              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                ✓ Resolved
                              </Typography>
                            )}
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
              <ScheduleModal 
                open={waterScheduleModalOpen} 
                onClose={() => setWaterScheduleModalOpen(false)}
                item={selectedWater}
                onSchedule={fetchWaters}
                endpoint="water"
              />
            </>
          )}

          {tab === 'grievances' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Grievances</Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                  <Grid container spacing={2}>
                    {grievances.map(g => (
                      <Grid size={{ xs: 12, md: 6 }} key={g._id}>
                        <Paper variant="outlined" sx={{ p: 2 }}>
                          <Typography variant="h6">{g.subject}</Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>{g.description}</Typography>
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                             By: {g.name} • {new Date(g.createdAt).toLocaleDateString()}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: 2 }} alignItems="center">
                            {g.status !== 'resolved' ? (
                              <Select size="small" value={g.status || 'open'} onChange={(e) => updateStatus('grievance', g._id, e.target.value, fetchGrievances)}>
                                <MenuItem value="open">Open</MenuItem>
                                <MenuItem value="in-progress">In-Progress</MenuItem>
                                <MenuItem value="resolved">Resolved</MenuItem>
                              </Select>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                                ✓ Resolved
                              </Typography>
                            )}
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
              </Paper>
            </>
          )}

          {tab === 'locations' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>Submitted Locations</Typography>
              <Paper sx={{ p: 2 }}>
                <AdminLocations />
              </Paper>
            </>
          )}

          {tab === 'logs' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>System Logs</Typography>
              <Paper sx={{ p: 2 }}>
                  <Grid container spacing={1}>
                    {logs.map(l => (
                      <Grid size={{ xs: 12 }} key={l._id}>
                        <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#f5f5f5' }}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            <span style={{ color: '#009688' }}>[{new Date(l.createdAt).toLocaleString()}]</span>
                            <strong> {l.action}</strong>: {l.message}
                            <span style={{ color: '#ff7043' }}> ({l.entityType})</span>
                          </Typography>
                          {(l.meta && (l.meta.ip || l.meta.ua)) && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {l.meta.ip && <>IP: {l.meta.ip} </>}
                              {l.meta.ua && <>• UA: {l.meta.ua}</>}
                            </Typography>
                          )}
                          {l.createdBy && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              By: {l.createdBy.fullName || l.createdBy.email} {l.createdBy.email && `(${l.createdBy.email})`}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
              </Paper>
            </>
          )}

          {tab === 'userlogins' && (
            <>
              <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold', mb: 2 }}>User Logins</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Paper sx={{ p: 2, maxHeight: '60vh', overflow: 'auto' }}>
                    <Typography variant="subtitle1" sx={{ mb: 1 }}>All Users</Typography>
                    <List>
                      <ListItemButton selected={selectedUser === 'all'} onClick={() => setSelectedUser('all')}>
                        <ListItemText primary="All users" secondary={`${users.length || 0} users`} />
                      </ListItemButton>
                      {users.map(u => (
                        <ListItemButton key={u._id} selected={selectedUser === u._id} onClick={() => setSelectedUser(u._id)}>
                          <ListItemText primary={u.fullName || u.email} secondary={u.email} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                  <Paper sx={{ p: 2 }}>
                    {loading ? <Typography>Loading...</Typography> : (
                      <>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                          <Typography variant="subtitle2">Filter:</Typography>
                          <Select size="small" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} sx={{ minWidth: 220 }}>
                            <MenuItem value="all">All users</MenuItem>
                            {users.map(u => (
                              <MenuItem key={u._id} value={u._id}>{u.fullName || u.email}</MenuItem>
                            ))}
                          </Select>
                        </Stack>

                        <Grid container spacing={1}>
                          {selectedUserLogins.length ? selectedUserLogins
                            .filter(l => {
                              if (selectedUser === 'all') return true;
                              if (l.createdBy && l.createdBy._id) return l.createdBy._id === selectedUser;
                              if (l.meta && l.meta.email) {
                                const u = users.find(x => x._id === selectedUser);
                                return u && u.email === l.meta.email;
                              }
                              return false;
                            })
                            .map(l => (
                              <Grid size={{ xs: 12 }} key={l._id}>
                                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#fff' }}>
                                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                    <span style={{ color: '#009688' }}>[{new Date(l.createdAt).toLocaleString()}]</span>
                                    <strong> {l.action === 'login' ? 'Success' : 'Failed'}</strong>
                                    : {l.message}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary" display="block">
                                    User: {l.createdBy ? (l.createdBy.fullName || l.createdBy.email) : (l.meta && l.meta.email) || 'Unknown'} {l.createdBy && l.createdBy.email && `(${l.createdBy.email})`}
                                  </Typography>
                                  {(l.meta && (l.meta.ip || l.meta.ua)) && (
                                    <Typography variant="caption" color="text.secondary" display="block">
                                      {l.meta.ip && <>IP: {l.meta.ip} </>}
                                      {l.meta.ua && <>• UA: {l.meta.ua}</>}
                                    </Typography>
                                  )}
                                </Paper>
                              </Grid>
                            )) : <Typography color="text.secondary">No login events found</Typography>}
                        </Grid>
                      </>
                    )}
                  </Paper>
                </Grid>
              </Grid>
            </>
          )}

        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;