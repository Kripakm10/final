import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  IconButton,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";



const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [isWorker, setIsWorker] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!input.fullName || input.fullName.length < 2)
      return setErrorMessage("Full name is required");
    if (!input.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email))
      return setErrorMessage("Valid email is required");
    if (!input.password || input.password.length < 6)
      return setErrorMessage("Password must be at least 6 characters");
    if (input.password !== input.confirmPassword)
      return setErrorMessage("Passwords do not match");
    if (!agree) return setErrorMessage("You must agree to the terms");

    axios
      .post(`${API_BASE_URL}/api/s`, {
        fullName: input.fullName,
        email: input.email,
        password: input.password,
        phone: input.phone,
        city: input.city,
        role: isWorker ? "worker" : "user",
      })
      .then((response) => {
        // --- LOGIC CORRECTION ---
        // 1. Handle Flat Data
        const data = response.data;
        const user = data;
        const token = data.token;

        // 2. FIX: Save to sessionStorage (so Dashboard can find it immediately)
        if (token) sessionStorage.setItem("token", token);
        if (user) sessionStorage.setItem("user", JSON.stringify(user));

        setSuccessMessage("Signup successful!");
        setErrorMessage("");

        setTimeout(() => {
          // Check role directly from the flat data object
          if (user?.role === "admin") navigate("/admin");
          else if (user?.role === "worker") navigate("/worker");
          else navigate("/user");
        }, 700);
      })
      .catch((error) => {
        console.error("Signup error:", error, error?.response?.data);
        const msg =
          error?.response?.data?.message ||
          (error?.response?.data?.errors &&
            error.response.data.errors[0]?.msg) ||
          "Signup failed. Please try again.";
        setErrorMessage(msg);
        setSuccessMessage("");
      });
  };

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <>
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
        {/* Abstract shapes */}
        <Box
          sx={{
            position: "absolute",
            bottom: "-10%",
            left: "-5%",
            width: "40vw",
            height: "40vw",
            background: isDark
              ? "radial-gradient(circle, rgba(255,112,67,0.08) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(255,112,67,0.04) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 480,
            bgcolor: isDark ? alpha(theme.palette.background.paper, 0.8) : alpha("#fff", 0.8),
            backdropFilter: "blur(20px)",
            borderRadius: 6,
            boxShadow: isDark
              ? "0 20px 60px rgba(0,0,0,0.4)"
              : "0 20px 60px rgba(0,0,0,0.1)",
            p: { xs: 3, md: 5 },
            border: "1px solid",
            borderColor: alpha(theme.palette.divider, 0.1),
            position: "relative",
            zIndex: 1,
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            align="center"
            sx={{
              fontWeight: 800,
              background: isDark
                ? `linear-gradient(90deg, #fff, ${theme.palette.primary.main})`
                : `linear-gradient(90deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Join Smart City
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            Get started with Smart City services
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              name="fullName"
              value={input.fullName}
              onChange={inputHandler}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              name="email"
              value={input.email}
              onChange={inputHandler}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              name="password"
              value={input.password}
              type={showPassword ? "text" : "password"}
              onChange={inputHandler}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              variant="outlined"
              margin="normal"
              name="confirmPassword"
              value={input.confirmPassword}
              type={showPassword ? "text" : "password"}
              onChange={inputHandler}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <TextField
              fullWidth
              label="Phone"
              variant="outlined"
              margin="normal"
              name="phone"
              value={input.phone}
              onChange={inputHandler}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              fullWidth
              label="City"
              variant="outlined"
              margin="normal"
              name="city"
              value={input.city}
              onChange={inputHandler}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isWorker}
                  onChange={(e) => setIsWorker(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2" color="primary" fontWeight="bold">
                  Sign up as Field Worker
                </Typography>
              }
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the <Link href="#">terms</Link> and privacy policy
                </Typography>
              }
            />

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                mt: 3,
                py: 1.5,
                borderRadius: 50,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
              }}
            >
              Sign Up
            </Button>
          </form>

          {successMessage && (
            <Typography
              variant="body1"
              align="center"
              color="success.main"
              sx={{ mt: 2 }}
            >
              {successMessage}
            </Typography>
          )}
          {errorMessage && (
            <Typography
              variant="body1"
              align="center"
              color="error.main"
              sx={{ mt: 2 }}
            >
              {errorMessage}
            </Typography>
          )}

          <Typography
            variant="body2"
            align="center"
            sx={{ mt: 3, color: "text.secondary" }}
          >
            Already have an account?{" "}
            <Link
              component={RouterLink}
              to="/login"
              underline="hover"
              color="secondary"
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Signup;
