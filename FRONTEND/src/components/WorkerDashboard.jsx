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
} from "@mui/material";
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
      // Fetch both waste and water assigned tasks
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

      // Combine and add 'type' field
      const combined = [
        ...(Array.isArray(wData)
          ? wData.map((i) => ({ ...i, type: "waste" }))
          : []),
        ...(Array.isArray(waterData)
          ? waterData.map((i) => ({ ...i, type: "water" }))
          : []),
      ];

      // Sort by date (newest first)
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

  return (
    <Box sx={{ bgcolor: "#f0f4f8", minHeight: "100vh" }}>
      <Navbar />
      <Box sx={{ p: 2, maxWidth: 800, mx: "auto", mt: 8 }}>
        <Typography
          variant="h5"
          sx={{ mb: 2, fontWeight: "bold", color: theme.palette.primary.main }}
        >
          My Assigned Tasks
        </Typography>

        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <Grid container spacing={2}>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <Grid size={{ xs: 12 }} key={task._id}>
                  <Paper
                    sx={{
                      p: 2,
                      borderLeft: `6px solid ${task.type === "waste" ? "#ff7043" : "#2196f3"}`,
                    }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="start"
                    >
                      <Box>
                        <Typography
                          variant="h6"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {task.type === "waste"
                            ? task.wasteType
                            : task.issueType}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1 }}
                        >
                          {task.address}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            bgcolor: "#eee",
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                          }}
                        >
                          Status: {task.status}
                        </Typography>
                        {task.name && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            Customer: {task.name} ({task.contact || task.phone})
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        {task.status !== "Resolved" &&
                        task.status !== "collected" &&
                        task.status !== "resolved" ? (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                              setSelectedTask(task);
                              setModalOpen(true);
                              setMessage("");
                              setError("");
                            }}
                          >
                            Verify & Close
                          </Button>
                        ) : (
                          <Typography color="success.main" fontWeight="bold">
                            Completed
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Box sx={{ mt: 2 }}>
                      <Button
                        size="small"
                        variant="outlined"
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.address)}`}
                        target="_blank"
                      >
                        Open Map
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography>No active tasks assigned.</Typography>
            )}
          </Grid>
        )}

        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 320,
              bgcolor: "background.paper",
              p: 4,
              borderRadius: 2,
              boxShadow: 24,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>
              Verify Completion
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Ask the citizen for their 4-digit PIN to verify and close this
              job.
            </Typography>

            <TextField
              fullWidth
              label="Enter 4-digit PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              inputProps={{ maxLength: 4 }}
              sx={{ mb: 2 }}
            />

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {message && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {message}
              </Alert>
            )}

            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={!!message}
            >
              Verify & Complete
            </Button>
          </Box>
        </Modal>
      </Box>
    </Box>
  );
};

export default WorkerDashboard;
