import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Modal,
  TextField,
  Stack,
  Alert,
  useTheme,
  alpha,
  Card,
  Chip,
  IconButton,
  Avatar
} from "@mui/material";
import { Assignment, Map, CheckCircle, Lock } from "@mui/icons-material";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";
import { useNavigate } from "react-router-dom";

const WorkerDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [pin, setPin] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const getHeaders = () => {
    const token = sessionStorage.getItem("token");
    return token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const headers = getHeaders();
      const [wRes, waterRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/waste/assigned`, { headers }),
        fetch(`${API_BASE_URL}/api/water/assigned`, { headers }),
      ]);

      if (wRes.status === 401 || waterRes.status === 401) {
        navigate("/login");
        return;
      }

      const wData = await wRes.json();
      const waterData = await waterRes.json();

      const combined = [
        ...(Array.isArray(wData)
          ? wData.map((i) => ({ ...i, type: "waste" }))
          : []),
        ...(Array.isArray(waterData)
          ? waterData.map((i) => ({ ...i, type: "water" }))
          : []),
      ];

      combined.sort(
        (a, b) =>
          new Date(b.createdAt || b.submittedAt) -
          new Date(a.createdAt || a.submittedAt),
      );

      setTasks(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleVerify = async () => {
    if (!pin || pin.length !== 4) {
      setError("Please enter a valid 4-digit PIN");
      return;
    }
    setError("");
    setMessage("");

    try {
      const endpoint = selectedTask.type === "waste" ? "waste" : "water";
      const res = await fetch(
        `${API_BASE_URL}/api/${endpoint}/${selectedTask._id}/verify`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ pin }),
        },
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Verification failed");
        return;
      }

      setMessage(data.message);
      setPin("");
      setTimeout(() => {
        setModalOpen(false);
        fetchTasks();
      }, 1500);
    } catch (err) {
      setError("Network error");
    }
  };

  const isCompleted = (status) =>
    ["Resolved", "collected", "resolved"].includes(status);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 900, mx: "auto", mt: 10 }}>

        {/* Header */}
        <Box sx={{ mb: 5, animation: "fadeIn 0.5s ease-out" }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 1 }}>
            <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
              <Assignment />
            </Avatar>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>
              Field Operations
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Manage your assigned tasks and verify service completion.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={3}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Grid size={{ xs: 12 }} key={task._id}>
                  <Card
                    elevation={0}
                    sx={{
                      p: 0,
                      borderRadius: 6,
                      bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "#fff",
                      backdropFilter: "blur(20px)",
                      border: "1px solid",
                      borderColor: alpha(theme.palette.divider, 0.1),
                      transition: "transform 0.2s ease",
                      "&:hover": { transform: "translateY(-4px)" }
                    }}
                  >
                    <Box sx={{
                      p: 3,
                      borderLeft: "6px solid",
                      borderColor: task.type === "waste" ? "secondary.main" : "primary.main"
                    }}>
                      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "start" }} spacing={2}>
                        <Box flex={1}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Chip
                              label={task.type.toUpperCase()}
                              size="small"
                              sx={{
                                fontWeight: 800,
                                fontSize: "0.7rem",
                                bgcolor: alpha(task.type === "waste" ? theme.palette.secondary.main : theme.palette.primary.main, 0.1),
                                color: task.type === "waste" ? "secondary.main" : "primary.main"
                              }}
                            />
                            <Typography variant="caption" color="text.secondary">
                              #{task._id.slice(-6)}
                            </Typography>
                          </Stack>
                          <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                            {task.type === "waste" ? task.wasteType : task.issueType}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                            <Map fontSize="inherit" /> {task.address}
                          </Typography>

                          <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: alpha(theme.palette.background.default, 0.5) }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary", display: 'block', mb: 0.5 }}>
                              CITIZEN CONTACT
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {task.name || "N/A"} • {task.contact || task.phone || "No contact"}
                            </Typography>
                          </Paper>
                        </Box>

                        <Box sx={{ minWidth: 160, textAlign: { sm: "right" } }}>
                          {isCompleted(task.status) ? (
                            <Chip
                              icon={<CheckCircle />}
                              label="Completed"
                              color="success"
                              variant="outlined"
                              sx={{ px: 1, fontWeight: "bold", borderRadius: 2 }}
                            />
                          ) : (
                            <Stack spacing={2}>
                              <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Lock />}
                                onClick={() => {
                                  setSelectedTask(task);
                                  setModalOpen(true);
                                  setMessage("");
                                  setError("");
                                }}
                                sx={{ borderRadius: 50, textTransform: "none", fontWeight: "bold" }}
                              >
                                Verify PIN
                              </Button>
                              <Button
                                variant="outlined"
                                color="inherit"
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`}
                                target="_blank"
                                size="small"
                                sx={{ borderRadius: 50, textTransform: "none" }}
                              >
                                Directions
                              </Button>
                            </Stack>
                          )}
                        </Box>
                      </Stack>
                    </Box>
                  </Card>
                </Grid>
              ))
            ) : (
              <Box sx={{ width: '100%', py: 10, textAlign: 'center' }}>
                <Typography color="text.secondary">No active tasks assigned.</Typography>
              </Box>
            )}
          </Grid>
        )}

        <Modal
          open={modalOpen}
          onClose={() => !loading && setModalOpen(false)}
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 400,
              bgcolor: isDark ? alpha(theme.palette.background.paper, 0.9) : "#fff",
              backdropFilter: "blur(20px)",
              p: 4,
              borderRadius: 6,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              border: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.1),
              outline: "none",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>
              Complete Task
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter the 4-digit verification PIN provided by the citizen to confirm service delivery.
            </Typography>

            <TextField
              fullWidth
              label="Verification PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputProps={{ maxLength: 4, style: { textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem', fontWeight: 900 } }}
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              autoFocus
            />

            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
            {message && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>{message}</Alert>}

            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleVerify}
              disabled={!!message || loading}
              sx={{ py: 1.5, borderRadius: 50, fontWeight: "bold", textTransform: "none" }}
            >
              Confirm Completion
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default WorkerDashboard;
