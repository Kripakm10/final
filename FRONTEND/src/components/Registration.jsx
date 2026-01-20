import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  CssBaseline,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  createTheme,
  ThemeProvider,
  Grid,
  Paper,
  Stack,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';

// Custom theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#009688' },
    secondary: { main: '#ff7043' },
    background: { default: '#f4f6f8' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

// Kerala Districts
const keralaDistricts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha",
  "Kottayam", "Idukki", "Ernakulam", "Thrissur",
  "Palakkad", "Malappuram", "Kozhikode", "Wayanad",
  "Kannur", "Kasaragod"
];

// Department Options
const departmentOptions = [
  "Water Supply Management",
  "Waste Management",
  "Grievance Redressal"
];

// Sub-options for Waste Management
const wasteOptions = [
  "Municipal Solid Waste", "Biomedical Waste", "Hazardous Waste",
  "E-Waste", "Construction and Demolition Waste", "Agricultural Waste", "Plastic Waste",
];

// Sub-options for Water Supply
const waterOptions = [
  "Surface Water (River/Dam)", "Groundwater (Borewell/Well)",
  "Rainwater Harvesting", "Recycled / Treated Water",
];

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address1: "", address2: "", city: "", district: "",
    zip: "", department: "", subOption: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // client-side validation
    if (!formData.firstName || formData.firstName.length < 2) return setError('First name is required');
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return setError('Valid email is required');
    if (!formData.phone || !/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) return setError('Valid phone is required');
    if (!formData.department) return setError('Please select a department');

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:3000/api/registrations', formData);
      setSuccess(res.data?.message || 'Registration submitted');
      setFormData({ firstName: "", lastName: "", email: "", phone: "", address1: "", address2: "", city: "", district: "", zip: "", department: "", subOption: "" });
    } catch (err) {
      console.error('Registration error', err);
      const msg = err?.response?.data?.message || 'Submission failed. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url('https://images.unsplash.com/photo-1549921296-3a6bde0f0d42?auto=format&fit=crop&w=1950&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            bgcolor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 4,
            boxShadow: 8,
            p: 4,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Smart City Registration
          </Typography>

          <Typography variant="subtitle1" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
            Join the future of city management
          </Typography>

          <form onSubmit={handleSubmit}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" sx={{ mt: 0, mb: 2 }} color="secondary">
                Contact Information
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }} color="secondary">
                Address
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Street Address" name="address1" value={formData.address1} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="City" name="city" value={formData.city} onChange={handleChange} required />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="district-label">District</InputLabel>
                    <Select labelId="district-label" name="district" value={formData.district} onChange={handleChange}>
                      {keralaDistricts.map((district) => (
                        <MenuItem key={district} value={district}>{district}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }} color="secondary">
                Department
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth required>
                    <InputLabel id="department-label">Department</InputLabel>
                    <Select labelId="department-label" name="department" value={formData.department} onChange={handleChange}>
                      {departmentOptions.map((dept) => (
                        <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {formData.department === "Waste Management" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="waste-label">Waste Type</InputLabel>
                      <Select labelId="waste-label" name="subOption" value={formData.subOption} onChange={handleChange}>
                        {wasteOptions.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {formData.department === "Water Supply Management" && (
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth>
                      <InputLabel id="water-label">Water Source</InputLabel>
                      <Select labelId="water-label" name="subOption" value={formData.subOption} onChange={handleChange}>
                        {waterOptions.map((opt) => (
                          <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                  <Stack direction="row" spacing={2} justifyContent="flex-end">
                    <Button variant="outlined" color="inherit" onClick={() => setFormData({ firstName: "", lastName: "", email: "", phone: "", address1: "", address2: "", city: "", district: "", zip: "", department: "", subOption: "" })}>
                      Reset
                    </Button>
                    <Button fullWidth={false} type="submit" variant="contained" color="primary" sx={{ minWidth: 160 }} startIcon={loading ? <CircularProgress size={18} color="inherit" /> : null}>
                      {loading ? 'Submitting...' : 'Register'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>

              {success && (
                <Snackbar open autoHideDuration={4500} onClose={() => setSuccess('')}>
                  <Alert onClose={() => setSuccess('')} severity="success">{success}</Alert>
                </Snackbar>
              )}

              {error && (
                <Alert severity="error" onClose={() => setError('')} sx={{ mt: 2 }}>{error}</Alert>
              )}
            </Paper>
          </form>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Registration;