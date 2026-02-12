import React from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Chip,
  Avatar,
  Paper,
  IconButton,
  TextField,
  useTheme,
  alpha,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  DeleteOutline,
  Opacity,
  ReportProblem,
  HowToReg,
  Facebook,
  Twitter,
  Instagram,
  LocationOn,
  Email,
  Phone,
  ArrowForward,
} from "@mui/icons-material";
import Navbar from "./Navbar";
import { keyframes } from "@mui/system";

// 🌟 Animations
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const features = [
  {
    title: "Waste Management",
    description:
      "AI-driven tracking for garbage collection, smart bins, and city-wide cleanliness.",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80",
    icon: <DeleteOutline color="inherit" />,
    color: "#009688",
  },
  {
    title: "Water Supply",
    description:
      "Real-time monitoring of water levels, leak detection, and distribution optimization.",
    image:
      "https://images.unsplash.com/photo-1523362628408-3c2601a0d09c?auto=format&fit=crop&w=800&q=80",
    icon: <Opacity color="inherit" />,
    color: "#2196f3",
  },
  {
    title: "Grievance Redressal",
    description:
      "Transparent reporting system connecting citizens directly to city officials.",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80",
    icon: <ReportProblem color="inherit" />,
    color: "#ff7043",
  },
];

const Home = () => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        minHeight: "100vh",
        overflowX: "hidden",
      }}
    >
      <Navbar />

      {/* 🚀 Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          pt: { xs: 12, md: 10 },
          overflow: "hidden",
          background: isDark
            ? "radial-gradient(circle at 50% 50%, #1a2035 0%, #0b1221 100%)"
            : "radial-gradient(circle at 50% 50%, #f0f7ff 0%, #ffffff 100%)",
        }}
      >
        {/* Abstract Background Shapes */}
        <Box
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: "50vw",
            height: "50vw",
            background: isDark
              ? "radial-gradient(circle, rgba(0,150,136,0.15) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,150,136,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "40vw",
            height: "40vw",
            background: isDark
              ? "radial-gradient(circle, rgba(255,112,67,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,112,67,0.08) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Text Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ animation: `${fadeIn} 1s ease-out` }}>
                <Chip
                  label="Smart City 2.0"
                  sx={{
                    mb: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: "primary.main",
                    fontWeight: "bold",
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  }}
                />
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 3,
                    background: isDark
                      ? "linear-gradient(90deg, #fff 30%, #a5b4fc 100%)"
                      : "linear-gradient(90deg, #111827 30%, #4b5563 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: { xs: "2.5rem", md: "3.75rem" },
                  }}
                >
                  Build the future <br />
                  <span style={{ color: theme.palette.primary.main }}>
                    of your city.
                  </span>
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: "text.secondary",
                    mb: 5,
                    lineHeight: 1.6,
                    maxWidth: 500,
                  }}
                >
                  Experience the next generation of urban management.
                  Monitoring, reporting, and resolution — effortless and
                  transparent.
                </Typography>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    component={RouterLink}
                    to="/signup"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForward />}
                    sx={{
                      py: 1.8,
                      px: 4,
                      borderRadius: "50px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.4)}`,
                    }}
                  >
                    Get Started
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    size="large"
                    sx={{
                      py: 1.8,
                      px: 4,
                      borderRadius: "50px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textTransform: "none",
                      borderColor: "text.secondary",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "text.primary",
                        bgcolor: alpha(theme.palette.text.primary, 0.05),
                      },
                    }}
                  >
                    Sign In
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Floating Visuals */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  animation: `${float} 6s ease-in-out infinite`,
                }}
              >
                <Box
                  component="img"
                  src="https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=80"
                  alt="City Future"
                  sx={{
                    width: "100%",
                    borderRadius: 8,
                    boxShadow: isDark
                      ? "0 20px 80px rgba(0,0,0,0.6)"
                      : "0 20px 80px rgba(0,0,0,0.2)",
                    transform: "perspective(1000px) rotateY(-5deg)",
                  }}
                />

                {/* Floating Cards */}
                <Paper
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    left: -30,
                    p: 2,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    animation: `${float} 8s ease-in-out infinite reverse`,
                    bgcolor: "background.paper",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#4caf50" }}>
                    <Opacity />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Water Quality
                    </Typography>
                    <Typography
                      variant="caption"
                      color="success.main"
                      fontWeight="bold"
                    >
                      98% Optimal
                    </Typography>
                  </Box>
                </Paper>

                <Paper
                  sx={{
                    position: "absolute",
                    top: 40,
                    right: -20,
                    p: 2,
                    borderRadius: 4,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                    animation: `${float} 7s ease-in-out infinite`,
                    bgcolor: "background.paper",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#ff9800" }}>
                    <ReportProblem />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Issues Reported
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      12 New Reports
                    </Typography>
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 🔮 Capabilities Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Powerful Capabilities
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{
            mb: 8,
            maxWidth: 650,
            mx: "auto",
            fontSize: "1.15rem",
            lineHeight: 1.6,
          }}
        >
          A comprehensive ecosystem designed to manage urban infrastructure with
          real-time data, AI-driven insights, and citizen engagement.
        </Typography>

        <Grid container spacing={4}>
          {features.map((f, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 8,
                  bgcolor: isDark
                    ? alpha(theme.palette.background.paper, 0.4)
                    : "#fff",
                  backdropFilter: "blur(20px)",
                  transition:
                    "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                  border: "1px solid",
                  borderColor: alpha(theme.palette.divider, 0.1),
                  overflow: "hidden",
                  "&:hover": {
                    transform: "translateY(-12px)",
                    borderColor: f.color,
                    boxShadow: `0 30px 60px ${alpha(f.color, 0.1)}`,
                  },
                }}
                elevation={0}
              >
                <Box
                  sx={{
                    height: 200,
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={f.image}
                    alt={f.title}
                    sx={{
                      transition: "transform 0.5s",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 16,
                      right: 16,
                      bgcolor: "background.paper",
                      p: 1,
                      borderRadius: "50%",
                      color: f.color,
                    }}
                  >
                    {f.icon}
                  </Box>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    {f.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7 }}
                  >
                    {f.description}
                  </Typography>
                  <Button
                    endIcon={<ArrowForward />}
                    sx={{
                      mt: 3,
                      color: f.color,
                      p: 0,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Learn more
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* 🌌 Call to Action - Glassmorphism */}
      <Container maxWidth="md" sx={{ mb: 12 }}>
        <Box
          sx={{
            position: "relative",
            p: { xs: 4, md: 8 },
            borderRadius: 8,
            overflow: "hidden",
            textAlign: "center",
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          }}
        >
          {/* Noise/Texture Overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "url('https://www.transparenttextures.com/patterns/cubes.png')",
              opacity: 0.1,
            }}
          />

          <Typography
            variant="h3"
            sx={{
              color: "white",
              fontWeight: "bold",
              mb: 2,
              position: "relative",
            }}
          >
            Ready for the future?
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: "rgba(255,255,255,0.9)",
              mb: 5,
              position: "relative",
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Join thousands of citizens and administrators building the cities of
            tomorrow, today.
          </Typography>

          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "white",
              color: "primary.main",
              py: 2,
              px: 6,
              borderRadius: "50px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.9)",
              },
            }}
          >
            Start Your Journey
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: isDark ? "#0b0f19" : "#f9fafb", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                Smart City
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 300 }}
              >
                Redefining urban management with cutting-edge technology and
                human-centric design.
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <IconButton size="small">
                  <Facebook />
                </IconButton>
                <IconButton size="small">
                  <Twitter />
                </IconButton>
                <IconButton size="small">
                  <Instagram />
                </IconButton>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                Platform
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={RouterLink}
                  to="/"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Home
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={RouterLink}
                  to="/about"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  About
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={RouterLink}
                  to="/services"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Services
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={RouterLink}
                  to="/contact"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Contact
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={RouterLink}
                  to="/faq"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  FAQs
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component={RouterLink}
                  to="/privacy"
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Privacy
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                Stay Updated
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField
                  placeholder="Enter email"
                  size="small"
                  fullWidth
                  sx={{ bgcolor: "background.paper" }}
                />
                <Button variant="contained">Subscribe</Button>
              </Stack>
            </Grid>
          </Grid>
          <Box
            sx={{
              borderTop: "1px solid",
              borderColor: "divider",
              mt: 8,
              pt: 4,
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              © 2026 Smart City Management. All rights reserved.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
