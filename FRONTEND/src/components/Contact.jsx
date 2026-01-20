import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import Navbar from "./Navbar";

// uses global theme

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

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
    <>
      <Navbar />

      {/* 🔹 Contact Section */}
      <Box
        sx={{
          py: 8,
          px: { xs: 2, md: 6 },
          minHeight: "100vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1950&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, md: 6 },
            borderRadius: 3,
            maxWidth: 700,
            width: "100%",
            bgcolor: "rgba(255,255,255,0.9)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              background: "linear-gradient(90deg, #7AA2C1, #F5CBA7)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: "bold",
              mb: 2,
            }}
          >
            Contact Us
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Have questions or feedback about our Smart City Management
            initiative? We’d love to hear from you!
          </Typography>

          <Box sx={{ textAlign: "left", mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Email:</strong> support@smartcitymanagement.com
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Phone:</strong> +1 (555) 123-4567
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong> 123 Innovation Avenue, Tech Park, New
              York, NY 10001
            </Typography>
          </Box>

          {/* Contact Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  variant="outlined"
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
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Your Message"
                  name="message"
                  multiline
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  variant="outlined"
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              variant="contained"
              color="secondary"
              size="large"
              sx={{
                mt: 3,
                px: 4,
                py: 1,
                fontWeight: "bold",
                borderRadius: 2,
              }}
            >
              Send Message
            </Button>
          </Box>

          {/* Social Links */}
          <Box sx={{ mt: 5 }}>
            <Typography variant="h6" color="primary" sx={{ fontWeight: "bold" }}>
              Follow Us
            </Typography>
            <Box
              component="ul"
              sx={{
                listStyle: "none",
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 1,
                p: 0,
              }}
            >
              <li>
                <a
                  href="#"
                  style={{
                    color: "#7AA2C1",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: "#7AA2C1",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Twitter (X)
                </a>
              </li>
              <li>
                <a
                  href="#"
                  style={{
                    color: "#7AA2C1",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  Facebook
                </a>
              </li>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Contact;
