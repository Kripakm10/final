import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
} from "@mui/material";

const keralaDistricts = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];

const departmentOptions = [
  "Water Supply Management",
  "Waste Management",
  "Grievance Redressal",
];

const wasteOptions = [
  "Municipal Solid Waste",
  "Biomedical Waste",
  "Hazardous Waste",
  "E-Waste",
  "Construction and Demolition Waste",
  "Agricultural Waste",
  "Plastic Waste",
];

const waterOptions = [
  "Surface Water (River/Dam)",
  "Groundwater (Borewell/Well)",
  "Rainwater Harvesting",
  "Recycled / Treated Water",
];

const Registration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    district: "",
    zip: "",
    department: "",
    subOption: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.firstName || formData.firstName.length < 2)
      return setError("First name is required");
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return setError("Valid email is required");
    if (!formData.phone || !/^\+?[0-9\s-]{7,15}$/.test(formData.phone))
      return setError("Valid phone is required");
    if (!formData.department) return setError("Please select a department");

    try {
      setLoading(true);
      const res = await axios.post(
        `${API_BASE_URL}/api/registrations`,
        formData,
      );
      setSuccess(res.data?.message || "Registration submitted");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        city: "",
        district: "",
        zip: "",
        department: "",
        subOption: "",
      });
    } catch (err) {
      console.error("Registration error", err);
      const msg =
        err?.response?.data?.message || "Submission failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
        background: isDark
          ? "radial-gradient(circle at 50% 50%, #1a2035 0%, #0b1221 100%)"
          : "radial-gradient(circle at 50% 50%, #f0f7ff 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "40vw",
          height: "40vw",
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 700,
          bgcolor: isDark
            ? alpha(theme.palette.background.paper, 0.8)
            : alpha("#fff", 0.8),
          backdropFilter: "blur(20px)",
          borderRadius: 8,
          p: { xs: 3, md: 6 },
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h3"
          align="center"
          sx={{
            fontWeight: 900,
            mb: 1,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Registration
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 5 }}
        >
          Begin your journey towards a smarter, greener city.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Section: Personal Info */}
            <Grid item xs={12}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: 1.5,
                }}
              >
                Personal Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>

            {/* Section: Location */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: 1.5,
                }}
              >
                Location Details
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address1"
                value={formData.address1}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="District"
                name="district"
                value={formData.district}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              >
                {keralaDistricts.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Section: Service */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography
                variant="overline"
                sx={{
                  fontWeight: 800,
                  color: "primary.main",
                  letterSpacing: 1.5,
                }}
              >
                Service Preferences
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              >
                {departmentOptions.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {(formData.department === "Waste Management" ||
              formData.department === "Water Supply Management") && (
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label={
                    formData.department === "Waste Management"
                      ? "Waste Type"
                      : "Water Source"
                  }
                  name="subOption"
                  value={formData.subOption}
                  onChange={handleChange}
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                >
                  {(formData.department === "Waste Management"
                    ? wasteOptions
                    : waterOptions
                  ).map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            <Grid item xs={12} sx={{ mt: 4 }}>
              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="inherit"
                  onClick={() =>
                    setFormData({
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      address1: "",
                      address2: "",
                      city: "",
                      district: "",
                      zip: "",
                      department: "",
                      subOption: "",
                    })
                  }
                  sx={{
                    py: 1.5,
                    borderRadius: 50,
                    textTransform: "none",
                    fontWeight: 700,
                  }}
                >
                  Reset
                </Button>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: 50,
                    textTransform: "none",
                    fontWeight: 800,
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`,
                  }}
                  startIcon={
                    loading && <CircularProgress size={18} color="inherit" />
                  }
                >
                  {loading ? "Submitting..." : "Register Now"}
                </Button>
              </Stack>
            </Grid>
          </Grid>

          {success && (
            <Snackbar
              open
              autoHideDuration={4500}
              onClose={() => setSuccess("")}
            >
              <Alert
                icon={<CheckCircleOutlineIcon />}
                severity="success"
                sx={{ borderRadius: 3 }}
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
        </form>
      </Card>
    </Box>
  );
};

export default Registration;
