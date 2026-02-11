import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Navbar from "./Navbar";

const Grievance = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
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
    if (!formData.subject || formData.subject.length < 3)
      return setError("Please provide a subject");
    if (!formData.description || formData.description.length < 5)
      return setError("Please provide a detailed description");

    try {
      setLoading(true);
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const resp = await axios.post(`${API_BASE_URL}/api/grievance`, formData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setSuccess(resp.data?.message || "Grievance submitted");
      setFormData({ name: "", email: "", subject: "", description: "" });
    } catch (err) {
      console.error("Grievance submit error", err);
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
            backgroundImage: "url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1950&q=80')",
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
            Voice of the Citizen
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: "auto", lineHeight: 1.6 }}>
            Submit your concerns, feedback, or complaints. We are committed to transparency and resolving issues to make our city better for everyone.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            href="#grievance-form"
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
            File a Grievance
          </Button>
        </Box>
      </Box>

      <Box id="grievance-form" sx={{ py: 12, px: { xs: 2, md: 6 } }}>
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
            Complaint Details
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "grid", gap: 3 }}
          >
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label="Full name"
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
                  label="Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  fullWidth
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={5}
                  required
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
                  {loading ? "Submitting..." : "Submit Grievance"}
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
                      subject: "",
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

export default Grievance;
