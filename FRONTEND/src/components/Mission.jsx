import React from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
} from "@mui/material";
import Navbar from "./Navbar";



const Mission = () => {
  return (
    <>
      <Navbar />

      {/* 🔹 Hero Section */}
      <Box
        sx={{
          height: "60vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')",
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
            bgcolor: "background.paper", // Theme aware
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
            Our Mission & Vision
          </Typography>

          <Typography variant="h6" color="text.secondary">
            Building smarter, cleaner, and more sustainable cities through
            innovation, technology, and citizen collaboration.
          </Typography>
        </Box>
      </Box>

      {/* 🔹 Mission & Vision Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "background.paper" }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Mission Statement */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={6}
              sx={{
                p: 5,
                borderRadius: 3,
                textAlign: "center",
                height: "100%",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h5"
                color="primary"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To leverage cutting-edge technology, IoT, and data-driven
                insights to efficiently manage city resources, enhance quality
                of life, and promote sustainable urban growth. Smart City
                Management strives to create cities that are cleaner, safer,
                and more connected for every citizen.
              </Typography>
            </Paper>
          </Grid>

          {/* Vision Statement */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={6}
              sx={{
                p: 5,
                borderRadius: 3,
                textAlign: "center",
                height: "100%",
                boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              }}
            >
              <Typography
                variant="h5"
                color="secondary"
                sx={{ fontWeight: "bold", mb: 2 }}
              >
                Our Vision
              </Typography>
              <Typography variant="body1" color="text.secondary">
                To become a global leader in sustainable urban innovation,
                creating smart cities that balance technology with humanity.
                Our vision is to build resilient, inclusive communities that
                inspire progress, equity, and environmental stewardship.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* 🔹 Core Values Section */}
      <Box sx={{ py: 8, px: { xs: 2, md: 6 }, bgcolor: "background.default" }}>
        <Typography
          variant="h4"
          color="primary"
          align="center"
          sx={{ fontWeight: "bold", mb: 6 }}
        >
          Our Core Values
        </Typography>

        <Grid container spacing={4}>
          {[
            {
              title: "Innovation",
              desc: "Encouraging creativity and embracing emerging technologies to drive smarter solutions.",
            },
            {
              title: "Sustainability",
              desc: "Protecting the environment and promoting responsible growth for future generations.",
            },
            {
              title: "Transparency",
              desc: "Ensuring open communication and accountability in city governance and operations.",
            },
            {
              title: "Community",
              desc: "Engaging citizens, businesses, and institutions to collaboratively shape better cities.",
            },
          ].map((value, index) => (
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
                  color="primary"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  {value.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {value.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default Mission;
