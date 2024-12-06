import React, { useState, useEffect } from 'react';
import { auth } from '../Admin/firebaseConfig'; // Firebase Authentication
import { signOut } from 'firebase/auth'; // Import signOut function
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);

  const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'Recipe', path: '/recipe' },
    { label: 'Blog', path: '/blog' },
    { label: 'Products Review', path: '/products-review' },
    { label: 'Contact', path: '/contact' },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser); // Listen to auth state changes
    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error('Error signing out: ', error);
    });
  };

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: '#327da8' }}>
      <Toolbar>
        {/* App Title */}
        <Typography variant="h6" style={{ flexGrow: 1, textDecoration: 'none', color: 'white', fontWeight: 'bold' }}>
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            Classy Mama
          </Link>
        </Typography>

        {/* Full Menu (Tablet/Desktop View) */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          {menuItems.map((menu, index) => (
            <Button key={index} sx={{ color: 'white', fontWeight: 'bold', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
              <Link to={menu.path} style={{ textDecoration: 'none', color: 'inherit' }}>
                {menu.label}
              </Link>
            </Button>
          ))}
          {!user ? (
            <>
              <Button sx={{ color: 'white', fontWeight: 'bold', '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' } }}>
                <Link to="/login" style={{ textDecoration: 'none', color: 'inherit' }}>Login</Link>
              </Button>
              <Button sx={{ backgroundColor: '#FFD700', color: '#3f51b5', fontWeight: 'bold', '&:hover': { backgroundColor: '#FFC107', color: 'white' } }}>
                <Link to="/signup" style={{ textDecoration: 'none', color: 'inherit' }}>Signup</Link>
              </Button>
            </>
          ) : (
            <Button onClick={handleLogout} sx={{ color: 'white', fontWeight: 'bold' }}>
              Logout
            </Button>
          )}
        </Box>

        {/* Hamburger Menu (Mobile/Tablet View) */}
        <IconButton edge="end" color="inherit" aria-label="menu" sx={{ display: { xs: 'block', md: 'none' } }} onClick={toggleDrawer(true)}>
          <MenuIcon />
        </IconButton>

        {/* Drawer for Mobile/Tablet Menu */}
        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
          <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)}>
            <List>
              {menuItems.map((menu, index) => (
                <ListItem button key={index}>
                  <Link to={menu.path} style={{ textDecoration: 'none', color: 'black' }}>
                    <ListItemText primary={menu.label} />
                  </Link>
                </ListItem>
              ))}
              {!user ? (
                <>
                  <ListItem button>
                    <Link to="/login" style={{ textDecoration: 'none', color: 'black' }}>
                      <ListItemText primary="Login" />
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link to="/signup" style={{ textDecoration: 'none', color: 'black' }}>
                      <ListItemText primary="Signup" />
                    </Link>
                  </ListItem>
                </>
              ) : (
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
