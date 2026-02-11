import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  useTheme,
  alpha,
} from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { Menu as MenuIcon, Close as CloseIcon, Brightness4, Brightness7 } from "@mui/icons-material";
import { useColorMode } from "../context/ThemeContext";
import RegistrationModal from "./RegistrationModal";
import WasteModal from "./WasteModal";
import WaterModal from "./WaterModal";
import GrievanceModal from "./GrievanceModal";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const colorMode = useColorMode();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showReg, setShowReg] = useState(false);
  const [showWaste, setShowWaste] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showGrievance, setShowGrievance] = useState(false);

  const getUser = () => {
    const sessionUser = sessionStorage.getItem("user");
    const localUser = localStorage.getItem("user");
    if (sessionUser) return JSON.parse(sessionUser);
    if (localUser) return JSON.parse(localUser);
    return null;
  };

  const user = getUser();
  const open = Boolean(anchorEl);

  const handleMenu = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setAnchorEl(null);
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const menuItems = user
    ? user.role === "admin"
      ? [
        { label: "Admin Panel", to: "/admin" },
        { label: "About", to: "/about" },
        { label: "Contact", to: "/contact" },
      ]
      : user.role === "worker"
        ? [
          { label: "Worker Dashboard", to: "/worker" },
          { label: "About", to: "/about" },
          { label: "Contact", to: "/contact" },
        ]
        : [
          { label: "Dashboard", to: "/user" },
          { label: "About", to: "/about" },
          { label: "Contact", to: "/contact" },
        ]
    : [
      { label: "Home", to: "/home" },
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Register", to: "/signup" },
    ];

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid",
        borderColor: (theme) => alpha(theme.palette.divider, 0.1),
        bgcolor: (theme) => alpha(theme.palette.background.default, 0.8),
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/home"
            sx={{
              textDecoration: "none",
              fontWeight: 800,
              fontFamily: "Roboto, sans-serif",
              fontSize: { xs: "1.2rem", md: "1.5rem" },
              letterSpacing: -0.5,
              color: "text.primary"
            }}
          >
            SMART CITY
          </Typography>
        </Box>

        {/* Desktop Navigation - Centered Pill */}
        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            gap: 0.5,
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: (theme) => alpha(theme.palette.text.primary, 0.05),
            p: 0.5,
            borderRadius: 50,
            border: "1px solid",
            borderColor: (theme) => alpha(theme.palette.divider, 0.1),
          }}
        >
          {(!user ? [
            { label: "Home", to: "/home" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" },
          ] : user.role === "user" ? [
            { label: "Waste", action: () => setShowWaste(true) },
            { label: "Water", action: () => setShowWater(true) },
            { label: "Grievance", action: () => setShowGrievance(true) },
          ] : [
            { label: "Dashboard", to: user.role === "admin" ? "/admin" : user.role === "worker" ? "/worker" : "/user" },
            { label: "About", to: "/about" },
            { label: "Contact", to: "/contact" }
          ]).map((item) => (
            <Button
              key={item.label}
              component={item.to ? RouterLink : "button"}
              to={item.to}
              onClick={item.action}
              color="inherit"
              sx={{
                borderRadius: 50,
                px: 2,
                textTransform: "none",
                color: "text.secondary",
                "&:hover": {
                  color: "text.primary",
                  bgcolor: "background.paper",
                }
              }}
            >
              {item.label}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {!user && (
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="small"
              sx={{
                borderRadius: 50,
                textTransform: "none",
                px: 2,
                borderColor: (theme) => alpha(theme.palette.divider, 0.2),
                color: "text.primary"
              }}
            >
              Sign In
            </Button>
          )}
          {user && (
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              size="small"
              sx={{
                border: "1px solid",
                borderColor: (theme) => alpha(theme.palette.divider, 0.1),
              }}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                  bgcolor: "primary.main"
                }}
              >
                {(user.fullName || user.email || "U")[0].toUpperCase()}
              </Avatar>
            </IconButton>
          )}
          <IconButton onClick={colorMode.toggleColorMode} color="inherit" size="small">
            {theme.palette.mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
              mt: 1.5,
              borderRadius: 3,
              minWidth: 150,
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate(user?.role === 'admin' ? '/admin' : user?.role === 'worker' ? '/worker' : '/user')} sx={{ borderRadius: 1.5, mx: 0.5 }}>
            Profile
          </MenuItem>
          <MenuItem onClick={logout} sx={{ borderRadius: 1.5, mx: 0.5, color: "error.main" }}>
            Logout
          </MenuItem>
        </Menu>



        {/* Mobile Hamburger Menu */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            gap: 1,
          }}
        >
          {user && (
            <IconButton
              color="inherit"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <Avatar
                sx={{
                  width: 35,
                  height: 35,
                  bgcolor: "secondary.main",
                  fontSize: 14,
                }}
              >
                {(user.fullName || user.email || "U")[0].toUpperCase()}
              </Avatar>
            </IconButton>
          )}
          <IconButton
            color="inherit"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            sx={{ ml: 1 }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Box>
      </Toolbar>

      {/* Mobile Drawer Menu */}
      <Drawer
        anchor="top"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ display: { xs: "block", md: "none" } }}
      >
        <Box sx={{ width: "100%", pt: 2, pb: 2 }}>
          <List>
            {!user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to="/home"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to="/about"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    component={RouterLink}
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                {user.role === "user" && (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setShowWaste(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Waste
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setShowWater(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Water
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          setShowGrievance(true);
                          setMobileMenuOpen(false);
                        }}
                      >
                        Grievance
                      </ListItemButton>
                    </ListItem>
                  </>
                )}
                {menuItems.map((item) => (
                  <ListItem key={item.to} disablePadding>
                    <ListItemButton
                      component={RouterLink}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      sx={{
                        fontWeight:
                          item.label === "Admin Panel" ||
                            item.label === "Dashboard"
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {item.label}
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem disablePadding>
                  <ListItemButton onClick={logout}>Logout</ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Modals */}
      <RegistrationModal
        open={showReg}
        onClose={() => setShowReg(false)}
        onSuccess={() => { }}
      />
      <WasteModal
        open={showWaste}
        onClose={() => setShowWaste(false)}
        onSuccess={() => { }}
      />
      <WaterModal
        open={showWater}
        onClose={() => setShowWater(false)}
        onSuccess={() => { }}
      />
      <GrievanceModal
        open={showGrievance}
        onClose={() => setShowGrievance(false)}
        onSuccess={() => { }}
      />
    </AppBar>
  );
};

export default Navbar;
