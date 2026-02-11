import React, { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config/api';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  alpha,
  useTheme
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Reset = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleSubmit = (e) => {
    e.preventDefault();
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: isDark
          ? "radial-gradient(circle at 50% 50%, #1a2035 0%, #0b1221 100%)"
          : "radial-gradient(circle at 50% 50%, #f0f7ff 0%, #ffffff 100%)",
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "30vw",
          height: "30vw",
          background: "radial-gradient(circle, rgba(255, 112, 67, 0.08) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
        }}
      />

      <Card
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 400,
          bgcolor: isDark ? alpha(theme.palette.background.paper, 0.8) : alpha("#fff", 0.8),
          backdropFilter: "blur(20px)",
          borderRadius: 6,
          p: { xs: 4, md: 5 },
          textAlign: 'center',
          border: "1px solid",
          borderColor: alpha(theme.palette.divider, 0.1),
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
          zIndex: 1,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 800,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Recover Account
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          No worries! Just enter your email and we'll send you instructions to reset your password.
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{
              py: 1.5,
              borderRadius: 50,
              fontWeight: 800,
              textTransform: "none",
              boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.4)}`
            }}
          >
            Send Instructions
          </Button>
        </form>

        {message && (
          <Typography variant="body2" sx={{ mt: 3, p: 2, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2, color: "info.main", fontWeight: 600 }}>
            {message}
          </Typography>
        )}

        <Typography variant="body2" sx={{ mt: 4 }}>
          <RouterLink to="/login" style={{ color: theme.palette.primary.main, textDecoration: 'none', fontWeight: 700 }}>
            ← Back to Sign In
          </RouterLink>
        </Typography>
      </Card>
    </Box>
  );
};

export default Reset;
