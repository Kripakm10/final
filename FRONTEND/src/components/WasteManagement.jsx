import React, { useState } from "react";
import axios from 'axios';
import {
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
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
  CircularProgress
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Navbar from "./Navbar";

// 🎨 Same theme as the other pages
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" }, // Blue
    secondary: { main: "#ff7043" }, // Coral
    background: { default: "#f0f4f8" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
  },
});

const WasteManagement = () => {
  const [formData, setFormData] = useState({ name: "", address: "", contact: "", wasteType: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // simple client-side validation
    if (!formData.name || formData.name.length < 2) return setError('Please provide a valid full name');
    if (!formData.address || formData.address.length < 5) return setError('Please provide a valid address');
    if (!formData.contact || !/^\+?[0-9\s-]{7,15}$/.test(formData.contact)) return setError('Please provide a valid contact number');
    if (!formData.wasteType) return setError('Please select a waste type');

    try {
      setLoading(true);
      const resp = await axios.post('http://localhost:3000/api/waste', formData);
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      {/* 🔹 Hero Section */}
      <Box
        sx={{
          height: "60vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1590411208763-5e4c46dfc9b4?auto=format&fit=crop&w=1950&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Box
          sx={{
            bgcolor: "rgba(255,255,255,0.9)",
            p: 5,
            borderRadius: 3,
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          <Typography
            variant="h3"
            sx={{
              background: "linear-gradient(90deg, #1976d2, #ff7043)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Smart Waste Management
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Using smart technologies to monitor, manage, and optimize city waste
            collection for a cleaner and more sustainable environment.
          </Typography>

          {/* ✳️ Added line */}
          <Typography variant="body1" color="text.secondary">
            Track garbage collection, recycling, and smart bins across the city
            to ensure cleanliness and sustainability.
          </Typography>
        </Box>
      </Box>

      {/* 🔹 About Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "#fff" }}>
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
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "#f7fafc" }}>
        <Typography
          variant="h4"
          color="primary"
          align="center"
          sx={{ fontWeight: "bold", mb: 6 }}
        >
          Key Features
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Smart Bins with IoT Sensors",
              desc: "Bins equipped with sensors detect fill levels and send data to the central system in real-time.",
              img: "https://images.unsplash.com/photo-1624381977216-6b1f48e3bfa1?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Route Optimization",
              desc: "AI-powered algorithms create efficient routes for waste collection vehicles, saving fuel and time.",
              img: "https://images.unsplash.com/photo-1615397349750-8c4efb8e3177?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Recycling Tracking",
              desc: "Smart systems help monitor recycling rates, reduce contamination, and encourage waste segregation.",
              img: "https://images.unsplash.com/photo-1618590999969-c397b9cb5a08?auto=format&fit=crop&w=1200&q=80",
            },
            {
              title: "Real-time Monitoring Dashboard",
              desc: "City officials can view live data on waste collection, bin status, and analytics for better planning.",
              img: "https://images.unsplash.com/photo-1618342244436-94481ffde7b0?auto=format&fit=crop&w=1200&q=80",
            },
          ].map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={feature.img}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ fontWeight: "bold", mb: 1 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* 🔹 Benefits Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "#fff" }}>
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
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "#f7fafc" }}>
        <Typography
          variant="h4"
          color="primary"
          align="center"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          Apply for Waste Collection
        </Typography>

        <Paper
          elevation={6}
          sx={{
            maxWidth: 700,
            mx: "auto",
            p: 4,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.98)",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Full Name" name="name" value={formData.name} onChange={handleChange} required variant="outlined" fullWidth />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Contact Number" name="contact" value={formData.contact} onChange={handleChange} required variant="outlined" fullWidth />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <TextField label="Address" name="address" value={formData.address} onChange={handleChange} required variant="outlined" fullWidth />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField select label="Waste Type" name="wasteType" value={formData.wasteType} onChange={handleChange} required variant="outlined" fullWidth>
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
                  <Button type="submit" variant="contained" color="secondary" size="large" sx={{ flex: 1, py: 1.2, fontWeight: 'bold' }} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <SendIcon />} disabled={loading}>
                    {loading ? 'Submitting...' : 'Apply'}
                  </Button>
                  <Button variant="outlined" color="inherit" size="large" sx={{ py: 1.2 }} onClick={() => setFormData({ name: '', address: '', contact: '', wasteType: '' })}>
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
    </ThemeProvider>
  );
};

export default WasteManagement;
