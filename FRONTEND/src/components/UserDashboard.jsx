import React, { useEffect, useState } from "react";
import {
  Alert,
  useTheme,
  alpha,
  Card,
  CardContent,
  IconButton,
  Box,
  Stack,
  Typography,
  Avatar,
  Chip,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import {
  Logout,
  Settings,
  DeleteSweep,
  WaterDrop,
  ReportProblem,
  AccessTime,
  VpnKey,
} from "@mui/icons-material";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";
import ReportNotCollectedModal from "./ReportNotCollectedModal";
import ReportNotResolvedModal from "./ReportNotResolvedModal";

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
    if (!s) return "red";
    const st = String(s).toLowerCase();
    if (st === "collected" || st === "resolved" || st === "approved")
      return "green";
    if (st === "pending" || st === "open" || st === "rejected") return "red";
    if (st === "in-progress" || st === "in progress") return "orange";
    return "inherit";
  };

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

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
      navigate("/login");
    }
  }, []);

  const authHeaders = (token) => {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const fetchMine = async (token) => {
    try {
      setLoading(true);
      const headers = authHeaders(token);

      const [w, wa, g] = await Promise.all([
        fetch(`${API_BASE_URL}/api/waste/mine`, { headers }),
        fetch(`${API_BASE_URL}/api/water/mine`, { headers }),
        fetch(`${API_BASE_URL}/api/grievance/mine`, { headers }),
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
      console.error("fetch mine error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, md: 4 }, mt: 10 }}>
        {/* Header Section */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 4 }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 800, color: "text.primary" }}
            >
              Citizen Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your reports and track city services.
            </Typography>
          </Box>
          {user && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ borderRadius: 50, textTransform: "none" }}
            >
              Logout
            </Button>
          )}
        </Stack>

        {user && (
          <Card
            elevation={0}
            sx={{
              mb: 5,
              borderRadius: 6,
              bgcolor: isDark
                ? alpha(theme.palette.background.paper, 0.4)
                : "#fff",
              backdropFilter: "blur(20px)",
              border: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.1),
              p: 1,
            }}
          >
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    width: 70,
                    height: 70,
                    boxShadow: `0 8px 16px ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                >
                  {(user.fullName || user.email || "U")[0].toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {user.fullName}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {user.email}
                  </Typography>
                  <Chip
                    label={user.role || "Citizen"}
                    size="small"
                    sx={{
                      mt: 1,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      fontSize: "0.65rem",
                    }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 6,
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: "background.paper",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <DeleteSweep color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Waste Collection
                </Typography>
              </Stack>
              {wastes.length ? (
                wastes.map((w, i) => {
                  const isScheduled =
                    w.status === "scheduled" && w.scheduledTime;
                  const scheduledDate = isScheduled
                    ? new Date(w.scheduledTime)
                    : null;
                  const isPast = scheduledDate && new Date() > scheduledDate;
                  const canReport =
                    isPast &&
                    (w.status === "scheduled" || w.status === "not-collected");

                  return (
                    <Card
                      key={w._id || i}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 4,
                        bgcolor: isDark
                          ? alpha(theme.palette.background.default, 0.4)
                          : alpha(theme.palette.background.default, 0.6),
                        border: "1px solid",
                        borderColor: alpha(theme.palette.divider, 0.05),
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {w.wasteType || "Waste Collection"}
                        </Typography>
                        <Chip
                          label={w.status || "Pending"}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            bgcolor:
                              w.status === "collected"
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.warning.main, 0.1),
                            color:
                              w.status === "collected"
                                ? "success.main"
                                : "warning.main",
                            border: "none",
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {w.address}
                      </Typography>

                      {isScheduled && (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            mt: 2,
                            p: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 2,
                          }}
                        >
                          <AccessTime
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", color: "primary.main" }}
                          >
                            Scheduled: {scheduledDate.toLocaleString()}
                          </Typography>
                        </Stack>
                      )}

                      {w.verificationPin && w.status !== "collected" && (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            mt: 1,
                            p: 1,
                            bgcolor: alpha(theme.palette.secondary.main, 0.05),
                            borderRadius: 2,
                          }}
                        >
                          <VpnKey
                            sx={{ fontSize: 16, color: "secondary.main" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", color: "secondary.main" }}
                          >
                            PIN: {w.verificationPin}
                          </Typography>
                        </Stack>
                      )}

                      {canReport && (
                        <Button
                          fullWidth
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => {
                            setSelectedWaste(w);
                            setReportModalOpen(true);
                          }}
                          sx={{
                            mt: 2,
                            borderRadius: 50,
                            textTransform: "none",
                          }}
                        >
                          Report Not Collected
                        </Button>
                      )}
                    </Card>
                  );
                })
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No requests found
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 6,
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: "background.paper",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <WaterDrop color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Water Supply
                </Typography>
              </Stack>
              {waters.length ? (
                waters.map((w, i) => {
                  const isScheduled =
                    w.status === "scheduled" && w.scheduledTime;
                  const scheduledDate = isScheduled
                    ? new Date(w.scheduledTime)
                    : null;
                  const isPast = scheduledDate && new Date() > scheduledDate;
                  const canReport =
                    isPast &&
                    (w.status === "scheduled" || w.status === "not-resolved");

                  return (
                    <Card
                      key={w._id || i}
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 2,
                        borderRadius: 4,
                        bgcolor: isDark
                          ? alpha(theme.palette.background.default, 0.4)
                          : alpha(theme.palette.background.default, 0.6),
                        border: "1px solid",
                        borderColor: alpha(theme.palette.divider, 0.05),
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: alpha(theme.palette.primary.main, 0.3),
                          transform: "translateY(-4px)",
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        sx={{ mb: 1 }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {w.issueType || "Water Issue"}
                        </Typography>
                        <Chip
                          label={w.status || "Pending"}
                          size="small"
                          sx={{
                            fontWeight: "bold",
                            bgcolor:
                              w.status === "resolved"
                                ? alpha(theme.palette.success.main, 0.1)
                                : alpha(theme.palette.warning.main, 0.1),
                            color:
                              w.status === "resolved"
                                ? "success.main"
                                : "warning.main",
                          }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">
                        {w.address}
                      </Typography>

                      {isScheduled && (
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{
                            mt: 2,
                            p: 1,
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                            borderRadius: 2,
                          }}
                        >
                          <AccessTime
                            sx={{ fontSize: 16, color: "primary.main" }}
                          />
                          <Typography
                            variant="caption"
                            sx={{ fontWeight: "bold", color: "primary.main" }}
                          >
                            Scheduled: {scheduledDate.toLocaleString()}
                          </Typography>
                        </Stack>
                      )}

                      {canReport && (
                        <Button
                          fullWidth
                          size="small"
                          color="error"
                          variant="outlined"
                          onClick={() => {
                            setSelectedWater(w);
                            setReportWaterModalOpen(true);
                          }}
                          sx={{
                            mt: 2,
                            borderRadius: 50,
                            textTransform: "none",
                          }}
                        >
                          Report Not Resolved
                        </Button>
                      )}
                    </Card>
                  );
                })
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No reports found
                </Typography>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: "100%",
                borderRadius: 6,
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
                bgcolor: "background.paper",
              }}
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 3 }}
              >
                <ReportProblem color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Grievances
                </Typography>
              </Stack>
              {grievances.length ? (
                grievances.map((g, i) => (
                  <Card
                    key={g._id || i}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderRadius: 4,
                      bgcolor: isDark
                        ? alpha(theme.palette.background.default, 0.4)
                        : alpha(theme.palette.background.default, 0.6),
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.05),
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: alpha(theme.palette.primary.main, 0.3),
                        transform: "translateY(-4px)",
                      },
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      sx={{ mb: 1 }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold">
                        {g.subject}
                      </Typography>
                      <Chip
                        label={g.status || "Open"}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          bgcolor: alpha(
                            statusColor(g.status) === "green"
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                            0.1,
                          ),
                          color:
                            statusColor(g.status) === "green"
                              ? "success.main"
                              : "error.main",
                        }}
                      />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {g.description}
                    </Typography>
                  </Card>
                ))
              ) : (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  No grievances found
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        <ReportNotCollectedModal
          open={reportModalOpen}
          onClose={() => setReportModalOpen(false)}
          item={selectedWaste}
          onReport={() => {
            const storedToken = sessionStorage.getItem("token");
            if (storedToken) fetchMine(storedToken);
          }}
        />

        <ReportNotResolvedModal
          open={reportWaterModalOpen}
          onClose={() => setReportWaterModalOpen(false)}
          item={selectedWater}
          onReport={() => {
            const storedToken = sessionStorage.getItem("token");
            if (storedToken) fetchMine(storedToken);
          }}
        />
      </Box>
    </Box>
  );
};

export default UserDashboard;
