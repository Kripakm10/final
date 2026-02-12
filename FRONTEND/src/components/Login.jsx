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

const Login = () => {
  const [input, setInput] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const inputHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!input.email || !input.password) {
      setErrorMessage("Email and password are required");
      return;
    }

    axios
      .post(`${API_BASE_URL}/api/`, input)
      .then((response) => {
        console.log("Login Response:", response.data);
        const data = response.data;
        const token = data.token;
        const user = data.user || data;
        const message = data.message;
        const storage = remember ? localStorage : sessionStorage;

        if (token) storage.setItem("token", token);
        if (user) storage.setItem("user", JSON.stringify(user));

        setSuccessMessage(message || "Login successful!");

        setTimeout(() => {
          if (user && user.role === "admin") {
            navigate("/admin");
          } else if (user && user.role === "worker") {
            navigate("/worker");
          } else {
            navigate("/user");
          }
        }, 600);
      })
      .catch((error) => {
        console.error("Login error:", error);
        const msg =
          error?.response?.data?.message ||
          "Login failed. Please check your credentials.";
        setErrorMessage(msg);
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
          p: 2,
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
            top: "-10%",
            right: "-5%",
            width: "40vw",
            height: "40vw",
            background: isDark
              ? "radial-gradient(circle, rgba(0,150,136,0.1) 0%, transparent 70%)"
              : "radial-gradient(circle, rgba(0,150,136,0.05) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(60px)",
            zIndex: 0,
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: 420,
            bgcolor: isDark
              ? alpha(theme.palette.background.paper, 0.8)
              : alpha("#fff", 0.8),
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
            Welcome Back
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            sx={{ color: "text.secondary", mb: 3 }}
          >
            Secure access to your smart city dashboard
          </Typography>

          <form onSubmit={handleSubmit}>
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

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mt: 1,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                }
                label="Remember me"
              />

              <Link
                component={RouterLink}
                to="/res"
                underline="hover"
                color="secondary"
                variant="body2"
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: 50,
                fontWeight: "bold",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
              }}
            >
              Sign In
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
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/signup"
              underline="hover"
              color="secondary"
            >
              Create one
            </Link>
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Login;
