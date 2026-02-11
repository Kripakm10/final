import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  alpha
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Navbar from "./Navbar";

const WaterManagement = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    issueType: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name || formData.name.length < 2)
      return setError("Please provide your name");
    if (!formData.address || formData.address.length < 5)
      return setError("Please provide a valid address");
    if (!formData.issueType) return setError("Please select an issue type");

    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const resp = await axios.post(`${API_BASE_URL}/api/water`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSuccess(resp.data?.message || "Request submitted");
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        issueType: "",
        description: "",
      });
    } catch (err) {
      console.error("Water submit error", err);
      const msg =
        err?.response?.data?.message || "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />

      {/* 🔹 Hero Section */}
      <Box
        sx={{
          minHeight: "60vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: 12,
          pb: 8,
          px: 3,
          overflow: "hidden",
          background: isDark
            ? "radial-gradient(circle at 50% 50%, #1a2035 0%, #0b1221 100%)"
            : "radial-gradient(circle at 50% 50%, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isDark ? 0.15 : 0.08,
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha("#fff", 0.7),
            backdropFilter: "blur(20px)",
            p: { xs: 4, md: 8 },
            borderRadius: 8,
            textAlign: "center",
            maxWidth: 900,
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.1),
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
            }}
          >
            Sustainable Water Supply
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: "auto", lineHeight: 1.6 }}>
            Monitoring water quality, managing distribution, and ensuring every citizen has access to clean, safe water through smart infrastructure.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            href="#report-form"
            sx={{
              borderRadius: 50,
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              fontSize: "1.1rem",
              boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
            }}
          >
            Report an Issue
          </Button>
        </Box>
      </Box>

      <Box id="report-form" sx={{ py: 12, px: { xs: 2, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 800,
            mx: "auto",
            p: { xs: 3, md: 6 },
            borderRadius: 8,
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "#fff",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.1),
            boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: "center" }}>
            Submit Report
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  select
                  label="Issue Type"
                  name="issueType"
                  value={formData.issueType}
                  onChange={handleChange}
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  <MenuItem value="leak">Leak</MenuItem>
                  <MenuItem value="supply">Supply Interruption</MenuItem>
                  <MenuItem value="quality">Water Quality</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }} sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ flex: 2, py: 1.5, borderRadius: 50, fontWeight: "bold", textTransform: "none" }}
                  startIcon={
                    loading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : (
                      <SendIcon />
                    )
                  }
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit Request"}
                </Button>
                <Button
                  variant="outlined"
                  color="inherit"
                  size="large"
                  sx={{ flex: 1, py: 1.5, borderRadius: 50, textTransform: "none" }}
                  onClick={() =>
                    setFormData({
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                      issueType: "",
                      description: "",
                    })
                  }
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Box>

          {success && (
            <Snackbar
              open
              autoHideDuration={4500}
              onClose={() => setSuccess("")}
            >
              <Alert
                onClose={() => setSuccess("")}
                severity="success"
                sx={{ width: "100%" }}
                icon={<CheckCircleOutlineIcon />}
              >
                {success}
              </Alert>
            </Snackbar>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3, borderRadius: 3 }}>
              {error}
            </Alert>
          )}
        </Paper>
      </Box>
    </Box>
  );
};

export default WaterManagement;
