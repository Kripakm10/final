import React from 'react';
import {
  Box,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Stack,
  Avatar,
  Paper,
} from '@mui/material';
import Navbar from './Navbar';

// 🎨 Same theme as Home
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009688',
    },
    secondary: {
      main: '#ff7043',
    },
    background: {
      default: '#f0f4f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const values = [
  {
    title: 'Citizen-Centric Design',
    description:
      'We place citizens at the center of urban governance by making reporting, tracking, and communication effortless and transparent.',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Smart Infrastructure',
    description:
      'By integrating IoT and real-time monitoring, we help cities proactively manage resources like water, waste, and public services.',
    image:
      'https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Transparency & Trust',
    description:
      'Every request is trackable. Every action is visible. Our platform builds trust between citizens and city authorities.',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
  },
];

const About = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      {/* Hero Section */}
      <Box sx={{ position: 'relative', py: { xs: 8, md: 12 }, overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              "url('https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(6px) brightness(0.6)',
            transform: 'scale(1.05)',
          }}
        />
        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: 'center',
              borderRadius: 3,
              background: 'rgba(255,255,255,0.9)',
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 800, mb: 2 }}>
              About Smart City Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Building cleaner, smarter, and more responsive cities by connecting
              citizens, technology, and governance into one unified platform.
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }} color="primary">
                Our Mission
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                Smart City Management aims to simplify how cities operate by providing
                a digital bridge between citizens and municipal authorities.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                From reporting potholes to tracking water supply issues, our platform
                ensures faster resolutions, better accountability, and improved
                quality of life for everyone.
              </Typography>
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1496560736447-4c7f8f63f3a7?auto=format&fit=crop&w=1200&q=80"
                alt="Smart city"
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: '0 20px 40px rgba(2,6,23,0.12)',
                }}
              />
            </Grid> */}
          </Grid>
        </Container>
      </Box>

      {/* Values Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            sx={{ fontWeight: 'bold', mb: 4 }}
            color="primary"
          >
            What Drives Us
          </Typography>

          <Grid container spacing={3}>
            {values.map((v, i) => (
              <Grid item xs={12} md={4} key={i}>
                <Card
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 250ms ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 30px rgba(2,6,23,0.12)',
                    },
                  }}
                >
                  <CardMedia component="img" height="180" image={v.image} alt={v.title} />
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{i + 1}</Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {v.title}
                      </Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {v.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

    
    </ThemeProvider>
  );
};

export default About;
