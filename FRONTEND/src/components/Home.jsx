import React from 'react';
import {
  Box,
  Button,
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
  Chip,
  Avatar,
  Paper,
  IconButton,
  TextField,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { DeleteOutline, Opacity, ReportProblem, HowToReg, Facebook, Twitter, Instagram, LocationOn, Email, Phone } from '@mui/icons-material';
import Navbar from './Navbar';

// 🎨 Theme setup
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#009688', // Teal
    },
    secondary: {
      main: '#ff7043', // Coral
    },
    background: {
      default: '#f0f4f8',
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
  },
});

const features = [
  {
    title: 'Waste Management System',
    description:
      'Track garbage collection, recycling, and smart bins across the city to ensure cleanliness and sustainability.',
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Water Supply Monitoring',
    description:
      'Monitor real-time water supply, detect leaks, and optimize consumption for a sustainable urban future.',
    image:
      'https://images.unsplash.com/photo-1521207418485-99c705420785?auto=format&fit=crop&w=1200&q=80',
  },
  {
    title: 'Grievance Redressal System',
    description:
      'Report city issues directly, track resolution status, and improve transparency between citizens and authorities.',
    image:
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
  },
];

const Home = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      {/* Hero (with blurred background image) */}
      <Box sx={{ position: 'relative', overflow: 'hidden', pt: { xs: 6, md: 12 }, pb: { xs: 6, md: 8 } }}>
        {/* Blurred background layer */}
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Box sx={{
            position: 'absolute',
            inset: 0,
            backgroundImage: "url('https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1950&q=80')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px) brightness(0.6)',
            transform: 'scale(1.03)'
          }} />
          {/* soft gradient overlay to help text contrast */}
          <Box sx={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.12), rgba(0,0,0,0.06))' }} />
        </Box>

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3, bgcolor: 'rgba(255,255,255,0.82)', p: 3, borderRadius: 2, boxShadow: '0 8px 24px rgba(2,6,23,0.06)' }}>
                <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1.05 }} gutterBottom>
                  <Box component="span" sx={{ display: 'block', background: 'linear-gradient(90deg,#009688,#ff7043)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Smart</Box>
                  <Box component="span">City Management — Responsive, Transparent, Efficient</Box>
                </Typography>

                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Leverage IoT, citizen reporting, and real-time dashboards to keep your city clean,
                  its water flowing, and services working — all in one beautiful interface.
                </Typography>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
                  <Button component={RouterLink} to="/signup" variant="contained" size="large" sx={{ px: 4 }}>Get Started</Button>
                  <Button component={RouterLink} to="/login" variant="outlined" size="large">Sign In</Button>
                </Stack>

                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Chip icon={<DeleteOutline />} label="Waste" component={RouterLink} to="/waste" clickable />
                  <Chip icon={<Opacity />} label="Water" component={RouterLink} to="/water" clickable />
                  <Chip icon={<ReportProblem />} label="Grievance" component={RouterLink} to="/grievance" clickable />
                  <Chip icon={<HowToReg />} label="Services" component={RouterLink} to="/r" clickable />
                </Stack>

                {/* Stats */}
                <Grid container spacing={2} sx={{ mt: 4 }}>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} elevation={0}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>1.2k</Typography>
                      <Typography variant="caption" color="text.secondary">Requests</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} elevation={0}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>980</Typography>
                      <Typography variant="caption" color="text.secondary">Resolved</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} elevation={0}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>24/7</Typography>
                      <Typography variant="caption" color="text.secondary">Support</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }} elevation={0}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>300+</Typography>
                      <Typography variant="caption" color="text.secondary">Active Users</Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box component="img" src="https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1000&q=80" alt="city" sx={{ width: '100%', borderRadius: 3, boxShadow: '0 20px 40px rgba(2,6,23,0.12)' }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features */}
      <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" color="primary" sx={{ fontWeight: 'bold', mb: 4 }}>Key Capabilities</Typography>

          <Grid container spacing={3}>
            {features.map((f, i) => (
              <Grid key={i} item xs={12} md={4}>
                <Card sx={{ borderRadius: 3, overflow: 'hidden', '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 30px rgba(2,6,23,0.12)' }, transition: 'all 250ms ease' }} elevation={0}>
                  <CardMedia component="img" height="160" image={f.image} alt={f.title} />
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>{i + 1}</Avatar>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{f.title}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{f.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Footer */}
      <Box sx={{ bgcolor: 'linear-gradient(90deg,#009688, #ff7043)', py: 6 }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))' }} elevation={0}>
            <Typography variant="h5" sx={{ mb: 1, fontWeight: 'bold' }}>Ready to improve your city?</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Sign up now to start submitting requests and getting real impact.</Typography>
            <Button component={RouterLink} to="/signup" variant="contained" size="large">Create Account</Button>
          </Paper>
        </Container>
      </Box>

      {/* Large Footer */}
      <Box component="footer" sx={{ py: 8, bgcolor: '#0b1220', color: 'white' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>Smart City Management</Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.8)" sx={{ mb: 2 }}>
                Empowering citizens and administrators with tools to report issues,
                monitor services, and improve urban living — all with location-aware reporting.
              </Typography>

              <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                <IconButton aria-label="facebook" size="small" sx={{ color: 'white' }}>
                  <Facebook fontSize="small" />
                </IconButton>
                <IconButton aria-label="twitter" size="small" sx={{ color: 'white' }}>
                  <Twitter fontSize="small" />
                </IconButton>
                <IconButton aria-label="instagram" size="small" sx={{ color: 'white' }}>
                  <Instagram fontSize="small" />
                </IconButton>
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Quick Links</Typography>
              <Stack component="nav" spacing={1}>
                <Button component={RouterLink} to="/home" color="inherit" sx={{ justifyContent: 'flex-start', color: 'rgba(255,255,255,0.9)' }}>Home</Button>
                <Button component={RouterLink} to="/about" color="inherit" sx={{ justifyContent: 'flex-start', color: 'rgba(255,255,255,0.9)' }}>About</Button>
                <Button component={RouterLink} to="/contact" color="inherit" sx={{ justifyContent: 'flex-start', color: 'rgba(255,255,255,0.9)' }}>Contact</Button>
                <Button component={RouterLink} to="/r" color="inherit" sx={{ justifyContent: 'flex-start', color: 'rgba(255,255,255,0.9)' }}>Services</Button>
              </Stack>
            </Grid>

            <Grid item xs={12} md={3}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Contact Us</Typography>
              <Stack spacing={0.5}>
                <Typography variant="body2" color="rgba(255,255,255,0.85)"><LocationOn fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> City Hall, Main St, Your City</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.85)"><Phone fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> +1 (555) 123-4567</Typography>
                <Typography variant="body2" color="rgba(255,255,255,0.85)"><Email fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} /> support@smartcity.example</Typography>
              </Stack>
            </Grid>

            <Grid item xs={12} md={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>Newsletter</Typography>
              <Stack component="form" spacing={1} onSubmit={(e) => e.preventDefault()}>
                <TextField placeholder="Email address" size="small" variant="filled" sx={{ background: 'rgba(255,255,255,0.06)', borderRadius: 1 }} InputProps={{ sx: { color: 'white' } }} />
                <Button variant="contained" size="small">Subscribe</Button>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid rgba(255,255,255,0.08)', mt: 4, pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption">&copy; {new Date().getFullYear()} Smart City Management. All rights reserved.</Typography>
            <Stack direction="row" spacing={2}>
              <Button component={RouterLink} to="/privacy" color="inherit" sx={{ color: 'rgba(255,255,255,0.9)' }}>Privacy</Button>
              <Button component={RouterLink} to="/terms" color="inherit" sx={{ color: 'rgba(255,255,255,0.9)' }}>Terms</Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Home;