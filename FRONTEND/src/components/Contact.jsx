import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stack,
  IconButton,
  useTheme,
  alpha,
  Container,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  LinkedIn,
  Twitter,
  Facebook,
  Send,
} from "@mui/icons-material";
import Navbar from "./Navbar";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Thank you for contacting Smart City Management!");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />

      {/* 🚀 Header Section */}
      <Box
        sx={{
          pt: { xs: 16, md: 24 },
          pb: { xs: 8, md: 12 },
          textAlign: "center",
          background: isDark
            ? "radial-gradient(circle at 50% 50%, #1a2035 0%, #0b1221 100%)"
            : "radial-gradient(circle at 50% 50%, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              fontWeight: 900,
              mb: 3,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "3rem", md: "4.5rem" },
              letterSpacing: -1,
            }}
          >
            Get in touch.
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", fontWeight: 500 }}>
            Have questions or feedback about our Smart City Management initiative?
            Our team is here to help you build the future.
          </Typography>
        </Container>
      </Box>

      {/* 🔹 Contact Content */}
      <Container maxWidth="lg" sx={{ pb: 16 }}>
        <Grid container spacing={4}>
          {/* Contact Details Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 5,
                height: "100%",
                borderRadius: 8,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: "1px solid",
                borderColor: alpha(theme.palette.primary.main, 0.1),
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Contact Information</Typography>
                <Typography variant="body2" color="text.secondary">Fill out the form and our team will get back to you within 24 hours.</Typography>
              </Box>

              <Stack spacing={3}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
                    <Email />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>EMAIL</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>support@smartcity.gov</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
                    <Phone />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PHONE</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>+1 (555) 123-4567</Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main" }}>
                    <LocationOn />
                  </Avatar>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ADDRESS</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>123 Innovation Ave, NYC</Typography>
                  </Box>
                </Stack>
              </Stack>

              <Box sx={{ mt: "auto" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>Follow Our Progress</Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton sx={{ color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.05), "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}><LinkedIn /></IconButton>
                  <IconButton sx={{ color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.05), "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}><Twitter /></IconButton>
                  <IconButton sx={{ color: "primary.main", bgcolor: alpha(theme.palette.primary.main, 0.05), "&:hover": { bgcolor: alpha(theme.palette.primary.main, 0.1) } }}><Facebook /></IconButton>
                </Stack>
              </Box>
            </Box>
          </Grid>

          {/* Form Card */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 6 },
                borderRadius: 8,
                bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "#fff",
                backdropFilter: "blur(20px)",
                border: "1px solid",
                borderColor: alpha(theme.palette.divider, 0.1),
                boxShadow: "0 20px 60px rgba(0,0,0,0.05)",
              }}
            >
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Your Message"
                      name="message"
                      multiline
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      variant="outlined"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4 } }}
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  endIcon={<Send />}
                  sx={{
                    mt: 4,
                    px: 6,
                    py: 2,
                    fontWeight: 800,
                    borderRadius: 50,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: `0 8px 30px ${alpha(theme.palette.primary.main, 0.3)}`,
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Contact;
