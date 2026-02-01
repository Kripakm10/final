import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, Box, Menu, MenuItem, IconButton, Avatar, Stack, Drawer, List, ListItem, ListItemButton } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import RegistrationModal from './RegistrationModal';
import WasteModal from './WasteModal';
import WaterModal from './WaterModal';
import GrievanceModal from './GrievanceModal';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showReg, setShowReg] = useState(false);
  const [showWaste, setShowWaste] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showGrievance, setShowGrievance] = useState(false);


  const getUser = () => {
    const sessionUser = sessionStorage.getItem('user');
    const localUser = localStorage.getItem('user');
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
    navigate('/login');
  };

  const menuItems = user ? (
    user.role === 'admin' ? [
      { label: 'Admin Panel', to: '/admin' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' }
    ] : [
      { label: 'Dashboard', to: '/user' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' }
    ]
  ) : [
    { label: 'Home', to: '/home' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Register', to: '/signup' }
  ];

  return (
    <AppBar
      position="static"
      color="primary"
      elevation={3}
      sx={{ height: '70px', justifyContent: 'center' }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            component={RouterLink}
            to="/home"
            sx={{
              textDecoration: 'none',
              fontWeight: 'bold',
              fontFamily: 'Roboto, sans-serif',
              fontSize: { xs: '1.1rem', md: '1.5rem' },
              color: 'inherit',
              letterSpacing: 1
            }}
          >
            SMART CITY
          </Typography>
        </Box>

        {/* Desktop Navigation */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          {!user ? (
            <>
              <Button color="inherit" component={RouterLink} to="/home">Home</Button>
              <Button color="inherit" component={RouterLink} to="/about">About</Button>
              <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
              <Button color="inherit" component={RouterLink} to="/signup">Register</Button>
              <Button
                variant="outlined"
                color="inherit"
                component={RouterLink}
                to="/login"
                sx={{ ml: 1, borderRadius: 20 }}
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              {user.role !== 'admin' && (
                <>
                  <Button color="inherit" onClick={() => setShowWaste(true)}>Waste</Button>
                  <Button color="inherit" onClick={() => setShowWater(true)}>Water</Button>
                  <Button color="inherit" onClick={() => setShowGrievance(true)}>Grievance</Button>
                </>
              )}

              {user.role === 'admin' ? (
                <>
                  <Button color="inherit" component={RouterLink} to="/admin" sx={{ fontWeight: 'bold' }}>Admin Panel</Button>
                  <Button color="inherit" component={RouterLink} to="/about">About</Button>
                  <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
                </>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/user">Dashboard</Button>
                  <Button color="inherit" component={RouterLink} to="/about">About</Button>
                  <Button color="inherit" component={RouterLink} to="/contact">Contact</Button>
                </>
              )}

              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
                <Avatar
                  sx={{ width: 35, height: 35, bgcolor: 'secondary.main', fontSize: 16 }}
                >
                  {(user.fullName || user.email || 'U')[0].toUpperCase()}
                </Avatar>
              </IconButton>
            </>
          )}
        </Box>

        {/* Mobile Hamburger Menu */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          {user && (
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                sx={{ width: 35, height: 35, bgcolor: 'secondary.main', fontSize: 14 }}
              >
                {(user.fullName || user.email || 'U')[0].toUpperCase()}
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
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        <Box sx={{ width: '100%', pt: 2, pb: 2 }}>
          <List>
            {!user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/home" onClick={() => setMobileMenuOpen(false)}>
                    Home
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/about" onClick={() => setMobileMenuOpen(false)}>
                    About
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Contact
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/signup" onClick={() => setMobileMenuOpen(false)}>
                    Register
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={RouterLink} to="/login" onClick={() => setMobileMenuOpen(false)}>
                    Sign In
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                {user.role !== 'admin' && (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => { setShowWaste(true); setMobileMenuOpen(false); }}>
                        Waste
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => { setShowWater(true); setMobileMenuOpen(false); }}>
                        Water
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => { setShowGrievance(true); setMobileMenuOpen(false); }}>
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
                      sx={{ fontWeight: item.label === 'Admin Panel' || item.label === 'Dashboard' ? 'bold' : 'normal' }}
                    >
                      {item.label}
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem disablePadding>
                  <ListItemButton onClick={logout}>
                    Logout
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Modals */}
      <RegistrationModal open={showReg} onClose={() => setShowReg(false)} onSuccess={() => { }} />
      <WasteModal open={showWaste} onClose={() => setShowWaste(false)} onSuccess={() => { }} />
      <WaterModal open={showWater} onClose={() => setShowWater(false)} onSuccess={() => { }} />
      <GrievanceModal open={showGrievance} onClose={() => setShowGrievance(false)} onSuccess={() => { }} />
    </AppBar>
  );
};

export default Navbar;