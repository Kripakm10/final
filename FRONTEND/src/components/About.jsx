import React from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Avatar,
  Paper,
  useTheme,
  alpha,
} from "@mui/material";
import Navbar from "./Navbar";

const values = [
  {
    title: "Citizen-Centric Design",
    description:
      "We place citizens at the center of urban governance by making reporting, tracking, and communication effortless and transparent.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Smart Infrastructure",
    description:
      "By integrating IoT and real-time monitoring, we help cities proactively manage resources like water, waste, and public services.",
    image:
      "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Transparency & Trust",
    description:
      "Every request is trackable. Every action is visible. Our platform builds trust between citizens and city authorities.",
    image:
      "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  },
];

const About = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh" }}>
      <Navbar />

      {/* 🚀 Hero Section */}
      <Box
        sx={{
          position: "relative",
          pt: { xs: 16, md: 22 },
          pb: { xs: 10, md: 16 },
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
            backgroundImage:
              "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: isDark ? 0.2 : 0.1,
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontWeight: 900,
                fontSize: { xs: "3rem", md: "5rem" },
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                letterSpacing: -1,
              }}
            >
              Our Story.
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{
                maxWidth: 700,
                mx: "auto",
                fontWeight: 500,
                lineHeight: 1.6
              }}
            >
              Building cleaner, smarter, and more responsive cities by
              connecting citizens, technology, and governance into one unified
              platform.
            </Typography>
          </Box>

          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 8 },
              borderRadius: 8,
              bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : alpha("#fff", 0.7),
              backdropFilter: "blur(20px)",
              border: "1px solid",
              borderColor: alpha(theme.palette.divider, 0.1),
              boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
            }}
          >
            <Grid container spacing={6} alignItems="center">
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography
                  variant="h3"
                  sx={{ fontWeight: 900, mb: 3, letterSpacing: -0.5 }}
                >
                  Our Mission
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.7 }}>
                  Smart City Management aims to simplify how cities operate by
                  providing a digital bridge between citizens and municipal
                  authorities.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ fontSize: "1.1rem", lineHeight: 1.7 }}>
                  From reporting potholes to tracking water supply issues, our
                  platform ensures faster resolutions, better accountability, and
                  improved quality of life for everyone.
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1496560736447-4c7f8f63f3a7?auto=format&fit=crop&w=1200&q=80"
                  alt="Smart city"
                  sx={{
                    width: '100%',
                    borderRadius: 6,
                    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                  }}
                />
              </Grid>
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* 🌟 Values Section */}
      <Box sx={{ py: 16 }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 10 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 900, mb: 2, letterSpacing: -0.5 }}
            >
              What Drives Us
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: "auto" }}>
              Our core values guide every innovation and interaction on our platform.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {values.map((v, i) => (
              <Grid size={{ xs: 12, md: 4 }} key={i}>
                <Card
                  elevation={0}
                  sx={{
                    height: "100%",
                    borderRadius: 8,
                    overflow: "hidden",
                    bgcolor: isDark ? alpha(theme.palette.background.paper, 0.4) : "#fff",
                    backdropFilter: "blur(20px)",
                    border: "1px solid",
                    borderColor: alpha(theme.palette.divider, 0.1),
                    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                    "&:hover": {
                      transform: "translateY(-12px)",
                      borderColor: "primary.main",
                      boxShadow: `0 30px 60px ${alpha(theme.palette.primary.main, 0.1)}`,
                    },
                  }}
                >
                  <Box sx={{ height: 220, overflow: "hidden" }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={v.image}
                      alt={v.title}
                      sx={{ transition: "transform 0.6s", "&:hover": { transform: "scale(1.1)" } }}
                    />
                  </Box>
                  <CardContent sx={{ p: 4 }}>
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      sx={{ mb: 2 }}
                    >
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: "primary.main", fontWeight: 800 }}>
                        {i + 1}
                      </Avatar>
                      <Typography variant="h5" sx={{ fontWeight: 800 }}>
                        {v.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                      {v.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
