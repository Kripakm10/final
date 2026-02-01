import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// 🌈 Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#009688' },
    secondary: { main: '#ff7043' },
    background: { default: '#f0f4f8' },
  },
  typography: { fontFamily: 'Roboto, sans-serif' },
});

const Reset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Example API call
    axios
      .post(`${API_BASE_URL}/api/forgot-password`, { email })
      .then(() => {
        setMessage('If this email exists, a reset link has been sent.');
      })
      .catch(() => {
        setMessage('Something went wrong. Please try again.');
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          backgroundImage: `url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1950&q=80')`,
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
            maxWidth: 400,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: 4,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
            p: 4,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" color="primary" gutterBottom>
            Forgot Password
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Enter your email to receive a password reset link.
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2, py: 1 }}
            >
              Send Reset Link
            </Button>
          </form>

          {message && (
            <Typography variant="body2" color="secondary" sx={{ mt: 2 }}>
              {message}
            </Typography>
          )}

          <Typography variant="body2" sx={{ mt: 3, color: 'text.secondary' }}>
            <RouterLink to="/login" style={{ color: '#ff7043', textDecoration: 'none' }}>
              Back to Login
            </RouterLink>
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Reset;
