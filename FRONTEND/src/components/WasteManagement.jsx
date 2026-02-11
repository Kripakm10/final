import React, { useState } from "react";
import axios from 'axios';
import API_BASE_URL from '../config/api';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  MenuItem,
  Stack,
  Alert,
  Snackbar,
  CircularProgress,
  useTheme,
  alpha
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Navbar from "./Navbar";

const WasteManagement = () => {
  const [formData, setFormData] = useState({ name: "", address: "", contact: "", wasteType: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || formData.name.length < 2) return setError('Please provide a valid full name');
    if (!formData.address || formData.address.length < 5) return setError('Please provide a valid address');
    if (!formData.contact || !/^\+?[0-9\s-]{7,15}$/.test(formData.contact)) return setError('Please provide a valid contact number');
    if (!formData.wasteType) return setError('Please select a waste type');

    try {
      setLoading(true);
      const resp = await axios.post(`${API_BASE_URL}/api/waste`, formData);
      setSuccess(resp.data?.message || 'Request submitted');
      setFormData({ name: "", address: "", contact: "", wasteType: "" });
    } catch (err) {
      console.error('Waste submit error', err);
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* 🔹 Hero Section */}
      <Box
        sx={{
          minHeight: "70vh",
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
            backgroundImage: "url('https://images.unsplash.com/photo-1590411208763-5e4c46dfc9b4?auto=format&fit=crop&w=1950&q=80')",
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
            Clean Cities, Smart Future
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: "auto", lineHeight: 1.6 }}>
            Revolutionizing urban cleanliness with IoT-enabled waste monitoring, AI route optimization, and sustainable disposal solutions.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            size="large"
            href="#apply-form"
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
            Get Started
          </Button>
        </Box>
      </Box>

      {/* 🔹 About Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "background.paper" }}>
        <Typography
          variant="h4"
          color="primary"
          align="center"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          What is Smart Waste Management?
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          align="center"
          sx={{ maxWidth: 900, mx: "auto" }}
        >
          Smart Waste Management is an IoT-enabled system that optimizes waste
          collection, recycling, and disposal through data analytics and
          real-time monitoring. Sensors in smart bins track fill levels,
          enabling efficient route planning and reducing unnecessary pickups.
          This approach saves time, energy, and operational costs while keeping
          the city cleaner and greener.
        </Typography>
      </Box>

      {/* 🔹 Key Features */}
      <Box sx={{ py: 12, px: { xs: 2, md: 6 }, bgcolor: "background.default" }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: 800, mb: 8 }}
        >
          Key Features
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Smart Bins",
              desc: "IoT sensors detect fill levels and transmit data for real-time monitoring.",
              img: "https://images.unsplash.com/photo-1624381977216-6b1f48e3bfa1?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "AI Routes",
              desc: "Advanced algorithms optimize driver routes, reducing fuel and carbon footprint.",
              img: "https://images.unsplash.com/photo-1615397349750-8c4efb8e3177?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Live Tracking",
              desc: "Real-time visibility into collection progress and bin status across the city.",
              img: "https://images.unsplash.com/photo-1618590999969-c397b9cb5a08?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Analytics",
              desc: "Detailed insights into waste trends to help shape long-term city policies.",
              img: "https://images.unsplash.com/photo-1618342244436-94481ffde7b0?auto=format&fit=crop&w=1200&q=80",
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 6,
                  bgcolor: "background.paper",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  height: "100%",
                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
                    borderColor: "primary.main"
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.img}
                  alt={feature.title}
                  sx={{ filter: isDark ? "brightness(0.8)" : "none" }}
                />
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", mb: 1.5, color: "text.primary" }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 🔹 Benefits Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "background.paper" }}>
        <Typography
          variant="h4"
          color="primary"
          align="center"
          sx={{ fontWeight: "bold", mb: 6 }}
        >
          Benefits of Smart Waste Management
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Cleaner Cities",
              desc: "Minimizes overflowing bins and keeps streets cleaner with timely waste collection.",
            },
            {
              title: "Operational Efficiency",
              desc: "Reduces collection trips and fuel consumption through optimized routes.",
            },
            {
              title: "Environmental Sustainability",
              desc: "Encourages recycling and decreases landfill waste for a greener future.",
            },
            {
              title: "Data-Driven Decisions",
              desc: "Provides actionable insights for city administrators to plan better waste policies.",
            },
          ].map((benefit, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
              >
                <Typography
                  variant="h6"
                  color="secondary"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {benefit.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {benefit.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 🔹 Apply Form Section */}
      <Box id="apply-form" sx={{ py: 12, px: { xs: 2, md: 6 }, bgcolor: "background.default" }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: 800, mb: 6 }}
        >
          Request Collection
        </Typography>

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
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} required variant="outlined" fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required variant="outlined" fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select label="Waste Type" name="wasteType" value={formData.wasteType} onChange={handleChange} required variant="outlined" fullWidth sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}>
                  <MenuItem value="">Select Waste Type</MenuItem>
                  <MenuItem value="Municipal Solid Waste">Municipal Solid Waste</MenuItem>
                  <MenuItem value="Biomedical Waste">Biomedical Waste</MenuItem>
                  <MenuItem value="Hazardous Waste">Hazardous Waste</MenuItem>
                  <MenuItem value="E-Waste">E-Waste</MenuItem>
                  <MenuItem value="Construction and Demolition Waste">Construction and Demolition Waste</MenuItem>
                  <MenuItem value="Agricultural Waste">Agricultural Waste</MenuItem>
                  <MenuItem value="Plastic Waste">Plastic Waste</MenuItem>
                </TextField>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex', alignItems: 'center' }}>
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                  <Button type="submit" variant="contained" color="primary" size="large" sx={{ flex: 1, py: 1.5, borderRadius: 50, fontWeight: 'bold', textTransform: "none" }} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />} disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  <Button variant="outlined" color="inherit" size="large" sx={{ py: 1.5, borderRadius: 50, textTransform: "none", px: 3 }} onClick={() => setFormData({ name: '', address: '', contact: '', wasteType: '' })}>
                    Reset
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            {success && (
              <Snackbar open autoHideDuration={4500} onClose={() => setSuccess('')}>
                <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }} icon={<CheckCircleOutlineIcon />}>
                  {success}
                </Alert>
              </Snackbar>
            )}

            {error && (
              <Alert severity="error" onClose={() => setError('')}> {error} </Alert>
            )}
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default WasteManagement;
