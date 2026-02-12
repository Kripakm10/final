import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/api";
import {
  Box,
  Typography,
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
  IconButton,
  useMediaQuery,
  useTheme,
  alpha,
  Card,
  Chip,
  Tooltip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ListItemAvatar,
} from "@mui/material";
import {
  Dashboard,
  DeleteOutline,
  Opacity,
  ReportProblem,
  People,
  Settings,
  Menu as MenuIcon,
  Close as CloseIcon,
  LocationOn,
  PersonOutline,
  Badge,
  History,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import AdminLocations from "./AdminLocations";
import ScheduleModal from "./ScheduleModal";
import ReportDetailsModal from "./ReportDetailsModal";

const drawerWidth = 240;

const AdminDashboard = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Data States
  const [wastes, setWastes] = useState([]);
  const [waters, setWaters] = useState([]);
  const [grievances, setGrievances] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [userLogins, setUserLogins] = useState([]);
  const [users, setUsers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("all");
  // derived
  const selectedUserObj = users.find((u) => u._id === selectedUser) || null;
  const selectedUserLogins = userLogins.filter((l) => {
    if (selectedUser === "all") return true;
    if (l.createdBy && l.createdBy._id) return l.createdBy._id === selectedUser;
    if (l.meta && l.meta.email && selectedUserObj)
      return l.meta.email === selectedUserObj.email;
    return false;
  });
  const lastLogin = selectedUserLogins
    .filter((l) => l.action === "login")
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
  const failedCount = selectedUserLogins.filter(
    (l) => l.action === "login_failed",
  ).length;

  // Loading & Overview States
  const [loading, setLoading] = useState(false);
  const [overview, setOverview] = useState({
    wasteCount: 0,
    registrationCount: 0,
    userCount: 0,
    recentWastes: [],
    recentRegs: [],
    recentLogs: [],
  });
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedWaste, setSelectedWaste] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedWater, setSelectedWater] = useState(null);
  const [waterScheduleModalOpen, setWaterScheduleModalOpen] = useState(false);

  const navigate = useNavigate();
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  // Close drawer when tab changes on mobile
  const handleTabChange = (newTab) => {
    setTab(newTab);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  // 🔹 Helper: Get Headers from Session Storage
  const getAuthHeaders = () => {
    const token =
      sessionStorage.getItem("token") || localStorage.getItem("token");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  // 🔹 Helper: Handle Unauthorized Access
  const handleAuthError = (res) => {
    if (res.status === 401 || res.status === 403) {
      alert("Session expired or unauthorized. Please login again.");
      sessionStorage.clear();
      navigate("/login");
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (tab === "waste") fetchWastes();
    if (tab === "water") fetchWaters();
    if (tab === "grievances") fetchGrievances();
    if (tab === "registrations") fetchRegistrations();
    if (tab === "logs") fetchLogs();
    if (tab === "workforce") fetchWorkers();
    if (tab === "waste" || tab === "water") fetchWorkers(); // Ensure workers are loaded for assignment
    if (tab === "userlogins") {
      fetchUserLogins();
      fetchUsers();
    }
    if (tab === "workforce") fetchWorkers();
    if (tab === "overview") fetchOverview();
  }, [tab]);

  // --- API CALLS ---

  const fetchOverview = async () => {
    try {
      setOverviewLoading(true);
      const headers = getAuthHeaders();

      const [wRes, rRes, uRes, lRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/waste`, { headers }),
        fetch(`${API_BASE_URL}/api/registrations`, { headers }),
        fetch(`${API_BASE_URL}/api/users`, { headers }),
        fetch(`${API_BASE_URL}/api/logs`, { headers }),
      ]);

      if (handleAuthError(wRes)) return;

      const [wData, rData, uData, lData] = await Promise.all([
        wRes.json(),
        rRes.json(),
        uRes.json(),
        lRes.json(),
      ]);

      setOverview({
        wasteCount: wData.length || 0,
        registrationCount: rData.length || 0,
        userCount: uData.length || 0,
        recentWastes: wData.slice(0, 5),
        recentRegs: rData.slice(0, 5),
        recentLogs: lData.slice(0, 8),
      });
    } catch (err) {
      console.error("fetch overview", err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const fetchWastes = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/waste`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      setWastes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaters = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/water`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(res)) return;
      setWaters(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/grievance`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(res)) return;
      setGrievances(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/registrations`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(res)) return;
      setRegistrations(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/logs`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(res)) return;
      setLogs(await res.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserLogins = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/logs`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(res)) return;
      const all = await res.json();
      const logins = all.filter(
        (l) => l.action === "login" || l.action === "login_failed",
      );
      setUserLogins(logins);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/users`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error("fetchUsers", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/users?role=worker`, {
        headers: getAuthHeaders(),
      }); // Simple filter if backend supports or just use /api/workers
      // I created /api/workers endpoint in userController. Let's use that.
      const wRes = await fetch(`${API_BASE_URL}/api/workers`, {
        headers: getAuthHeaders(),
      });
      if (handleAuthError(wRes)) return;
      const data = await wRes.json();
      setWorkers(data || []);
    } catch (err) {
      console.error("fetchWorkers", err);
    } finally {
      setLoading(false);
    }
  };

  const verifyWorker = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/api/workers/${id}/verify`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      fetchWorkers();
    } catch (err) {
      console.error(err);
    }
  };

  const assignTask = async (endpoint, taskId, workerId) => {
    try {
      if (!workerId) return alert("Select a worker");
      await fetch(`${API_BASE_URL}/api/${endpoint}/${taskId}/assign`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ workerId }),
      });
      if (endpoint === "waste") fetchWastes();
      if (endpoint === "water") fetchWaters();
    } catch (err) {
      console.error(err);
    }
  };

  // --- ACTIONS ---

  const updateStatus = async (endpoint, id, status, refresh) => {
    try {
      await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteItem = async (endpoint, id, refresh) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${API_BASE_URL}/api/${endpoint}/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const drawer = (
    <Box
      sx={{
        height: "100%",
        bgcolor: isDark
          ? alpha(theme.palette.background.paper, 0.4)
          : alpha("#fff", 0.6),
        backdropFilter: "blur(20px)",
        borderRight: "1px solid",
        borderColor: alpha(theme.palette.divider, 0.1),
      }}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: -0.5,
          }}
        >
          ADMIN PANEL
        </Typography>
      </Box>
      <Divider sx={{ opacity: 0.1 }} />
      <List sx={{ px: 2, mt: 2 }}>
        {[
          { key: "overview", text: "Overview", icon: <Dashboard /> },
          { key: "waste", text: "Waste Mgmt", icon: <DeleteOutline /> },
          { key: "water", text: "Water Issues", icon: <Opacity /> },
          { key: "workforce", text: "Workforce", icon: <People /> },
          { key: "grievances", text: "Grievances", icon: <ReportProblem /> },
          { key: "locations", text: "Locations", icon: <Dashboard /> },
          { key: "userlogins", text: "Security", icon: <Settings /> },
          { key: "logs", text: "System Logs", icon: <ReportProblem /> },
        ].map((item) => (
          <ListItem key={item.key} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => handleTabChange(item.key)}
              selected={tab === item.key}
              sx={{
                borderRadius: 3,
                py: 1.2,
                transition: "all 0.2s",
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  color: "primary.main",
                  "& .MuiListItemIcon-root": { color: "primary.main" },
                },
                "&:hover": {
                  bgcolor: alpha(theme.palette.primary.main, 0.05),
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: tab === item.key ? "primary.main" : "text.secondary",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: tab === item.key ? 700 : 500,
                  fontSize: "0.95rem",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <Navbar />

      <Box sx={{ display: "flex", position: "relative" }}>
        {/* Mobile Hamburger Button */}
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            display: { xs: "flex", sm: "none" },
            position: "fixed",
            left: 16,
            top: 80,
            zIndex: 1200,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: "primary.dark",
            },
          }}
        >
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>

        {/* 🔹 Sidebar Drawer */}
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {/* Mobile Drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "transparent",
                border: "none",
                top: "70px",
                height: "calc(100% - 70px)",
              },
            }}
          >
            {drawer}
          </Drawer>
          {/* Desktop Drawer */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                bgcolor: "transparent",
                border: "none",
                top: "70px",
                height: "calc(100% - 70px)",
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        {/* 🔹 Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: { xs: 7, sm: 8 },
          }}
        >
          {tab === "overview" && (
            <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 900, color: "text.primary" }}
                >
                  System Overview
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Real-time monitoring of city services and infrastructure.
                </Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                  {
                    title: "Waste Requests",
                    value: overview.wasteCount,
                    color: theme.palette.primary.main,
                    icon: <DeleteOutline />,
                    link: "waste",
                  },
                  {
                    title: "User Accounts",
                    value: overview.userCount,
                    color: theme.palette.info.main,
                    icon: <People />,
                    link: "workforce",
                  },
                  {
                    title: "Activity Logs",
                    value: overview.recentLogs?.length,
                    color: theme.palette.secondary.main,
                    icon: <ReportProblem />,
                    link: "logs",
                  },
                ].map((stat, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                    <Card
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 2.5,
                        bgcolor: isDark
                          ? alpha(theme.palette.background.paper, 0.4)
                          : "#fff",
                        backdropFilter: "blur(20px)",
                        border: "1px solid",
                        borderColor: alpha(theme.palette.divider, 0.1),
                        transition:
                          "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                        "&:hover": {
                          transform: "translateY(-6px)",
                          borderColor: stat.color,
                        },
                      }}
                    >
                      <Avatar
                        sx={{
                          bgcolor: alpha(stat.color, 0.1),
                          color: stat.color,
                          width: 64,
                          height: 64,
                          fontSize: "2rem",
                        }}
                      >
                        {stat.icon}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="overline"
                          sx={{
                            color: "text.secondary",
                            fontWeight: 700,
                            letterSpacing: 1,
                          }}
                        >
                          {stat.title}
                        </Typography>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {stat.value}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setTab(stat.link)}
                            sx={{ color: stat.color }}
                          >
                            <Dashboard fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 6,
                      bgcolor: isDark
                        ? alpha(theme.palette.background.paper, 0.4)
                        : "#fff",
                      backdropFilter: "blur(20px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.1),
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      sx={{ mb: 3 }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        Recent Activity
                      </Typography>
                      <Button
                        size="small"
                        onClick={() => setTab("logs")}
                        sx={{
                          borderRadius: 50,
                          textTransform: "none",
                          fontWeight: 700,
                        }}
                      >
                        View System Logs
                      </Button>
                    </Stack>
                    <Stack spacing={1.5}>
                      {overviewLoading ? (
                        <CircularProgress
                          size={24}
                          sx={{ my: 2, mx: "auto", display: "block" }}
                        />
                      ) : (overview.recentLogs || []).length > 0 ? (
                        overview.recentLogs.map((l, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              bgcolor: alpha(
                                theme.palette.primary.main,
                                i === 0 ? 0.08 : 0.03,
                              ),
                              border: "1px solid",
                              borderColor: alpha(theme.palette.divider, 0.05),
                            }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {l.action}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              display="block"
                            >
                              {l.message}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.disabled",
                                mt: 0.5,
                                display: "block",
                              }}
                            >
                              {new Date(l.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          color="text.secondary"
                          align="center"
                          sx={{ py: 4 }}
                        >
                          No recent activity
                        </Typography>
                      )}
                    </Stack>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 6,
                      bgcolor: isDark
                        ? alpha(theme.palette.background.paper, 0.4)
                        : "#fff",
                      backdropFilter: "blur(20px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.1),
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
                      Recent Requests
                    </Typography>
                    <Stack spacing={1.5}>
                      {overviewLoading ? (
                        <CircularProgress
                          size={24}
                          sx={{ my: 2, mx: "auto", display: "block" }}
                        />
                      ) : (overview.recentWastes || []).length > 0 ? (
                        overview.recentWastes.map((w, i) => (
                          <Box
                            key={i}
                            sx={{
                              p: 2,
                              borderRadius: 3,
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              borderBottom:
                                i !== overview.recentWastes.length - 1
                                  ? "1px solid"
                                  : "none",
                              borderColor: alpha(theme.palette.divider, 0.05),
                            }}
                          >
                            <Box>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: 700 }}
                              >
                                {w.wasteType}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {w.address}
                              </Typography>
                            </Box>
                            <Chip
                              label={w.status}
                              size="small"
                              color={
                                w.status === "collected" ? "success" : "warning"
                              }
                              sx={{
                                fontWeight: 800,
                                borderRadius: 1.5,
                                height: 20,
                              }}
                            />
                          </Box>
                        ))
                      ) : (
                        <Typography
                          color="text.secondary"
                          align="center"
                          sx={{ py: 4 }}
                        >
                          No recent requests
                        </Typography>
                      )}
                    </Stack>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}

          {tab === "waste" && (
            <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    Waste Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Review and assign garbage collection requests.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={fetchWastes}
                  startIcon={<DeleteOutline />}
                >
                  Refresh
                </Button>
              </Box>

              {loading ? (
                <CircularProgress
                  sx={{ display: "block", mx: "auto", my: 5 }}
                />
              ) : (
                <Grid container spacing={3}>
                  {wastes.map((w) => (
                    <Grid size={{ xs: 12, md: 6 }} key={w._id}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 6,
                          bgcolor: isDark
                            ? alpha(theme.palette.background.paper, 0.4)
                            : "#fff",
                          backdropFilter: "blur(20px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.divider, 0.1),
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            borderColor: "primary.main",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          sx={{ mb: 2 }}
                        >
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {w.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <LocationOn fontSize="inherit" /> {w.address}
                            </Typography>
                          </Box>
                          <Chip
                            label={w.status || "Pending"}
                            color={
                              w.status === "collected" ? "success" : "warning"
                            }
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                          />
                        </Stack>

                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            p: 2,
                            borderRadius: 3,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, mb: 0.5 }}
                          >
                            Service Details
                          </Typography>
                          <Typography variant="body2">
                            Type: <strong>{w.wasteType}</strong>
                          </Typography>
                          {w.scheduledTime && (
                            <Typography variant="body2" color="info.main">
                              Scheduled:{" "}
                              <strong>
                                {new Date(w.scheduledTime).toLocaleString()}
                              </strong>
                            </Typography>
                          )}
                        </Box>

                        {w.assignedTo && (
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "secondary.main",
                              }}
                            >
                              {(w.assignedTo.fullName || "U").charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", lineHeight: 1 }}
                              >
                                ASSIGNED TO
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {w.assignedTo.fullName}
                              </Typography>
                            </Box>
                          </Paper>
                        )}

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          gap={1}
                        >
                          {!["collected", "Resolved"].includes(w.status) && (
                            <>
                              <Select
                                size="small"
                                defaultValue={
                                  w.assignedTo ? w.assignedTo._id : ""
                                }
                                displayEmpty
                                onChange={(e) =>
                                  assignTask("waste", w._id, e.target.value)
                                }
                                sx={{ minWidth: 150, borderRadius: 50 }}
                              >
                                <MenuItem value="" disabled>
                                  {w.assignedTo
                                    ? "Change Worker"
                                    : "Assign Worker"}
                                </MenuItem>
                                {workers
                                  .filter((x) => x.status === "active")
                                  .map((worker) => (
                                    <MenuItem
                                      key={worker._id}
                                      value={worker._id}
                                    >
                                      {worker.fullName}
                                    </MenuItem>
                                  ))}
                              </Select>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => {
                                  setSelectedWaste(w);
                                  setScheduleModalOpen(true);
                                }}
                                sx={{ borderRadius: 50 }}
                              >
                                {w.status === "scheduled"
                                  ? "Reschedule"
                                  : "Schedule"}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  updateStatus(
                                    "waste",
                                    w._id,
                                    "collected",
                                    fetchWastes,
                                  )
                                }
                                sx={{ borderRadius: 50 }}
                              >
                                Done
                              </Button>
                            </>
                          )}
                          {w.reports?.length > 0 && (
                            <Button
                              size="small"
                              variant="text"
                              color="error"
                              onClick={() => {
                                setSelectedWaste(w);
                                setReportModalOpen(true);
                              }}
                              sx={{ fontWeight: 700 }}
                            >
                              View Reports ({w.reports.length})
                            </Button>
                          )}
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
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
            </Box>
          )}

          {tab === "water" && (
            <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    Water Issues
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Monitor and resolve water-related complaints.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={fetchWaters}
                  startIcon={<Opacity />}
                >
                  Refresh
                </Button>
              </Box>

              {loading ? (
                <CircularProgress
                  sx={{ display: "block", mx: "auto", my: 5 }}
                />
              ) : (
                <Grid container spacing={3}>
                  {waters.map((w) => (
                    <Grid size={{ xs: 12, md: 6 }} key={w._id}>
                      <Card
                        elevation={0}
                        sx={{
                          p: 3,
                          borderRadius: 6,
                          bgcolor: isDark
                            ? alpha(theme.palette.background.paper, 0.4)
                            : "#fff",
                          backdropFilter: "blur(20px)",
                          border: "1px solid",
                          borderColor: alpha(theme.palette.divider, 0.1),
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            borderColor: theme.palette.info.main,
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          sx={{ mb: 2 }}
                        >
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {w.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.5,
                              }}
                            >
                              <LocationOn fontSize="inherit" /> {w.address}
                            </Typography>
                          </Box>
                          <Chip
                            label={w.status || "Pending"}
                            color={
                              ["resolved", "Resolved"].includes(w.status)
                                ? "success"
                                : "info"
                            }
                            size="small"
                            sx={{ fontWeight: 700, borderRadius: 2 }}
                          />
                        </Stack>

                        <Box
                          sx={{
                            bgcolor: alpha(theme.palette.info.main, 0.05),
                            p: 2,
                            borderRadius: 3,
                            mb: 2,
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ fontWeight: 700, mb: 0.5 }}
                          >
                            Issue Details
                          </Typography>
                          <Typography variant="body2">
                            Type: <strong>{w.issueType}</strong>
                          </Typography>
                          {w.description && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 1 }}
                            >
                              {w.description}
                            </Typography>
                          )}
                        </Box>

                        {w.assignedTo && (
                          <Paper
                            variant="outlined"
                            sx={{
                              p: 1.5,
                              borderRadius: 3,
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              mb: 2,
                            }}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: "info.main",
                              }}
                            >
                              {(w.assignedTo?.fullName || "A").charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: "block", lineHeight: 1 }}
                              >
                                ASSIGNED TO
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 600 }}
                              >
                                {w.assignedTo.fullName}
                              </Typography>
                            </Box>
                          </Paper>
                        )}

                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          gap={1}
                        >
                          {!["resolved", "Resolved"].includes(w.status) && (
                            <>
                              <Select
                                size="small"
                                defaultValue={
                                  w.assignedTo ? w.assignedTo._id : ""
                                }
                                displayEmpty
                                onChange={(e) =>
                                  assignTask("water", w._id, e.target.value)
                                }
                                sx={{ minWidth: 150, borderRadius: 50 }}
                              >
                                <MenuItem value="" disabled>
                                  {w.assignedTo
                                    ? "Change Worker"
                                    : "Assign Worker"}
                                </MenuItem>
                                {workers
                                  .filter((x) => x.status === "active")
                                  .map((worker) => (
                                    <MenuItem
                                      key={worker._id}
                                      value={worker._id}
                                    >
                                      {worker.fullName}
                                    </MenuItem>
                                  ))}
                              </Select>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => {
                                  setSelectedWater(w);
                                  setWaterScheduleModalOpen(true);
                                }}
                                sx={{ borderRadius: 50 }}
                              >
                                {w.status === "scheduled"
                                  ? "Reschedule"
                                  : "Schedule"}
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() =>
                                  updateStatus(
                                    "water",
                                    w._id,
                                    "resolved",
                                    fetchWaters,
                                  )
                                }
                                sx={{ borderRadius: 50 }}
                              >
                                Resolved
                              </Button>
                            </>
                          )}
                        </Stack>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
              <ScheduleModal
                open={waterScheduleModalOpen}
                onClose={() => setWaterScheduleModalOpen(false)}
                item={selectedWater}
                onSchedule={fetchWaters}
                endpoint="water"
              />
            </Box>
          )}

          {tab === "grievances" && (
            <>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Grievances
              </Typography>
              <Paper sx={{ p: 2, mb: 3 }}>
                <Grid container spacing={2}>
                  {grievances.map((g) => (
                    <Grid size={{ xs: 12, md: 6 }} key={g._id}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="h6">{g.subject}</Typography>
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {g.description}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ mt: 1, color: "text.secondary" }}
                        >
                          By: {g.name} •{" "}
                          {new Date(g.createdAt).toLocaleDateString()}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          sx={{ mt: 2 }}
                          alignItems="center"
                        >
                          {g.status !== "resolved" ? (
                            <Select
                              size="small"
                              value={g.status || "open"}
                              onChange={(e) =>
                                updateStatus(
                                  "grievance",
                                  g._id,
                                  e.target.value,
                                  fetchGrievances,
                                )
                              }
                            >
                              <MenuItem value="open">Open</MenuItem>
                              <MenuItem value="in-progress">
                                In-Progress
                              </MenuItem>
                              <MenuItem value="resolved">Resolved</MenuItem>
                            </Select>
                          ) : (
                            <Typography
                              variant="body2"
                              sx={{ color: "success.main", fontWeight: "bold" }}
                            >
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

          {tab === "locations" && (
            <>
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Submitted Locations
              </Typography>
              <Paper sx={{ p: 2 }}>
                <AdminLocations />
              </Paper>
            </>
          )}

          {tab === "logs" && (
            <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    System Logs
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Chronological record of all system events.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={fetchLogs}
                  startIcon={<History />}
                >
                  Refresh Logs
                </Button>
              </Box>

              <Card
                elevation={0}
                sx={{
                  p: 0,
                  borderRadius: 6,
                  bgcolor: isDark
                    ? alpha(theme.palette.background.paper, 0.4)
                    : "#fff",
                  backdropFilter: "blur(20px)",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  overflow: "hidden",
                }}
              >
                <List sx={{ p: 0 }}>
                  {logs.map((l, idx) => (
                    <React.Fragment key={l._id}>
                      <ListItem
                        sx={{
                          py: 2,
                          px: 3,
                          "&:hover": {
                            bgcolor: alpha(theme.palette.primary.main, 0.02),
                          },
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 1,
                              }}
                            >
                              <Box
                                component="span"
                                sx={{ color: "primary.main", fontWeight: 700 }}
                              >
                                [{new Date(l.createdAt).toLocaleString()}]
                              </Box>
                              <Box component="span" sx={{ fontWeight: 800 }}>
                                {l.action}
                              </Box>
                              <Box component="span" color="text.secondary">
                                {l.message}
                              </Box>
                            </Typography>
                          }
                          secondary={
                            <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                              <Chip
                                label={l.entityType}
                                size="small"
                                variant="outlined"
                                color="secondary"
                                sx={{
                                  height: 18,
                                  fontSize: "0.65rem",
                                  fontWeight: 800,
                                }}
                              />
                              {l.meta?.ip && (
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                >
                                  IP: {l.meta.ip}
                                </Typography>
                              )}
                              {l.createdBy && (
                                <Typography
                                  variant="caption"
                                  color="text.disabled"
                                >
                                  By:{" "}
                                  {l.createdBy.fullName || l.createdBy.email}
                                </Typography>
                              )}
                            </Stack>
                          }
                        />
                      </ListItem>
                      {idx < logs.length - 1 && (
                        <Divider sx={{ opacity: 0.05 }} />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </Card>
            </Box>
          )}

          {tab === "workforce" && (
            <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    Field Workforce
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Manage and verify field service agents.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={fetchWorkers}
                  startIcon={<Badge />}
                >
                  Refresh
                </Button>
              </Box>

              {loading ? (
                <CircularProgress
                  sx={{ display: "block", mx: "auto", my: 5 }}
                />
              ) : (
                <Grid container spacing={3}>
                  {workers.length > 0 ? (
                    workers.map((w) => (
                      <Grid size={{ xs: 12, md: 6, lg: 4 }} key={w._id}>
                        <Card
                          elevation={0}
                          sx={{
                            p: 3,
                            borderRadius: 6,
                            bgcolor: isDark
                              ? alpha(theme.palette.background.paper, 0.4)
                              : "#fff",
                            backdropFilter: "blur(20px)",
                            border: "1px solid",
                            borderColor: alpha(theme.palette.divider, 0.1),
                            transition: "all 0.3s ease",
                            "&:hover": {
                              transform: "translateY(-4px)",
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Avatar
                              sx={{
                                width: 56,
                                height: 56,
                                fontSize: "1.5rem",
                                fontWeight: 800,
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                                border: "1px solid",
                                borderColor: alpha(
                                  theme.palette.primary.main,
                                  0.2,
                                ),
                              }}
                            >
                              {(w.fullName || "W").charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {w.fullName}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {w.email}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {w.phone}
                              </Typography>
                            </Box>
                          </Stack>

                          <Divider sx={{ mb: 2, opacity: 0.1 }} />

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  display: "block",
                                  color: "text.disabled",
                                  fontWeight: 700,
                                }}
                              >
                                STATUS
                              </Typography>
                              <Chip
                                label={w.status || "active"}
                                color={
                                  w.status === "active" ? "success" : "warning"
                                }
                                size="small"
                                sx={{
                                  fontWeight: 700,
                                  borderRadius: 2,
                                  mt: 0.5,
                                }}
                              />
                            </Box>
                            {w.status === "pending" && (
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => verifyWorker(w._id)}
                                sx={{
                                  borderRadius: 50,
                                  fontWeight: 700,
                                  textTransform: "none",
                                }}
                              >
                                Approve Agent
                              </Button>
                            )}
                          </Stack>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography align="center" sx={{ py: 8 }}>
                        No field workers found.
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              )}
            </Box>
          )}

          {tab === "userlogins" && (
            <Box sx={{ animation: "fadeIn 0.5s ease-out" }}>
              <Box
                sx={{
                  mb: 4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 900 }}>
                    User Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Monitor user access and authentication history.
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  onClick={fetchUsers}
                  startIcon={<PersonOutline />}
                >
                  Refresh Users
                </Button>
              </Box>

              <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 6,
                      bgcolor: isDark
                        ? alpha(theme.palette.background.paper, 0.4)
                        : "#fff",
                      backdropFilter: "blur(20px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.1),
                    }}
                  >
                    <Box
                      sx={{
                        p: 3,
                        borderBottom: "1px solid",
                        borderColor: alpha(theme.palette.divider, 0.1),
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                        All Users
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {users.length} registered accounts
                      </Typography>
                    </Box>
                    <List sx={{ maxHeight: "60vh", overflow: "auto", p: 0 }}>
                      <ListItemButton
                        selected={selectedUser === "all"}
                        onClick={() => setSelectedUser("all")}
                        sx={{ py: 2, px: 3 }}
                      >
                        <ListItemText
                          primary="Security Overview"
                          secondary="All login attempts"
                          primaryTypographyProps={{ fontWeight: 700 }}
                        />
                      </ListItemButton>
                      <Divider sx={{ opacity: 0.05 }} />
                      {users.map((u) => (
                        <ListItemButton
                          key={u._id}
                          selected={selectedUser === u._id}
                          onClick={() => setSelectedUser(u._id)}
                          sx={{ py: 1.5, px: 3 }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                color: "primary.main",
                              }}
                            >
                              {u.fullName?.charAt(0) || u.email.charAt(0)}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={u.fullName || u.email}
                            secondary={u.email}
                            primaryTypographyProps={{
                              variant: "body2",
                              fontWeight: 700,
                            }}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </ListItemButton>
                      ))}
                    </List>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 6,
                      bgcolor: isDark
                        ? alpha(theme.palette.background.paper, 0.4)
                        : "#fff",
                      backdropFilter: "blur(20px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.1),
                      minHeight: "50vh",
                    }}
                  >
                    {loading ? (
                      <CircularProgress
                        sx={{ display: "block", mx: "auto", my: 10 }}
                      />
                    ) : (
                      <>
                        <Box sx={{ mb: 4 }}>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 800, mb: 1 }}
                          >
                            Login History
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Showing activity for:{" "}
                            <strong>
                              {selectedUser === "all"
                                ? "All Users"
                                : users.find((u) => u._id === selectedUser)
                                    ?.fullName || "User"}
                            </strong>
                          </Typography>
                        </Box>

                        <TableContainer
                          sx={{
                            borderRadius: 3,
                            border: "1px solid",
                            borderColor: alpha(theme.palette.divider, 0.05),
                          }}
                        >
                          <Table size="small">
                            <TableHead
                              sx={{
                                bgcolor: alpha(
                                  theme.palette.primary.main,
                                  0.03,
                                ),
                              }}
                            >
                              <TableRow>
                                <TableCell sx={{ fontWeight: 800 }}>
                                  Date & Time
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>
                                  User
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>
                                  IP Address
                                </TableCell>
                                <TableCell sx={{ fontWeight: 800 }}>
                                  Device / Browser
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {selectedUserLogins.map((log) => (
                                <TableRow key={log._id} hover>
                                  <TableCell sx={{ fontSize: "0.8rem" }}>
                                    {new Date(log.loginTime).toLocaleString()}
                                  </TableCell>
                                  <TableCell
                                    sx={{ fontSize: "0.8rem", fontWeight: 600 }}
                                  >
                                    {log.userId?.fullName ||
                                      log.userId?.email ||
                                      "Unknown"}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: "0.8rem",
                                      fontFamily: "monospace",
                                    }}
                                  >
                                    {log.ipAddress || "N/A"}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: "text.secondary",
                                      maxWidth: 200,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {log.userAgent || "Unknown"}
                                  </TableCell>
                                </TableRow>
                              ))}
                              {selectedUserLogins.length === 0 && (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    align="center"
                                    sx={{ py: 10 }}
                                  >
                                    No login records found.
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default AdminDashboard;
