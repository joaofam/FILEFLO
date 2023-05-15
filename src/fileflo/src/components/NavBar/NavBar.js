import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  NavLink,
} from 'react-router-dom';
import '../../App.css';
import Home from '../../pages/Home/Home';
import Upload from '../../pages/Upload/Upload';
import Download from '../../pages/Download';
import Profile from '../../pages/Profile/Profile';
import Register from '../../pages/Register/Register';
import Login from '../../pages/Login/Login';
import Confirm from '../../pages/ConfirmSignUp/ConformSignUp';
import Password from '../../pages/Passphrase/Passphrase';
import PrivateRoute from '../../routes/PrivateRoute';
import {
  getUser,
  getToken,
  setUserSession,
  resetUserSession,
} from '../../service/AuthService';
import axios from 'axios';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';

const pages = ['Home', 'Upload', 'About'];
const profile = ['Profile'];
const settings = ['Profile', 'Logout'];

const verifyTokenAPIURL =
  'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/verify';

const NavBar = () => {
  const [isAuthenicating, setAuthenicating] = useState(true);
  const [anchorElNav, setAnchorElNav] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (
      token === 'undefined' ||
      token === undefined ||
      token === null ||
      !token
    ) {
      return;
    }

    const requestConfig = {
      headers: {
        'x-api-key': 'mOZT1CQkd09PPTwCJ32Hp7qFhNrZPr2F65HMP0Fm',
      },
    };
    const requestBody = {
      user: getUser(),
      token: token,
    };

    axios
      .post(verifyTokenAPIURL, requestBody, requestConfig)
      .then((response) => {
        setUserSession(response.data.user, response.data.token);
        setAuthenicating(false);
      })
      .catch(() => {
        resetUserSession();
        setAuthenicating(false);
      });
  }, []);

  const token = getToken();
  if (isAuthenicating && token) {
    return <div className="content">...</div>;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <div className="App">
      <Router>
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <Box sx={{ flexGrow: 1 }}>
                <AdbIcon
                  sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
                  href="/home"
                />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/home"
                  sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                ></Typography>
              </Box>

              <Box sx={{ flexGrow: 2, display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  {pages.map((page) => (
                    <MenuItem key={page} onClick={handleCloseNavMenu}>
                      <Typography textAlign="center">
                        <NavLink
                          className={(navData) =>
                            navData.isActive ? 'active-style' : 'none'
                          }
                          style={{
                            textDecoration: 'none',
                            color: 'white',
                            fontSize: '18px',
                          }}
                          exact="true"
                          to={`/${page}`}
                        >
                          {page}
                        </NavLink>
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <AdbIcon
                sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, mr: 1 }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href=""
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '.3rem',
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                LOGO
              </Typography>
              <Box sx={{ flexGrow: 1.5, display: { xs: 'none', md: 'flex' } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    <NavLink
                      className={(navData) =>
                        navData.isActive ? 'active-style' : 'none'
                      }
                      style={{
                        textDecoration: 'none',
                        color: 'white',
                        fontSize: '18px',
                      }}
                      to={`/${page}`}
                    >
                      {page}
                    </NavLink>
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
                {profile.map((page) => (
                  <Button
                    key={page}
                    onClick={handleCloseNavMenu}
                    sx={{ my: 2, color: 'white', display: 'block' }}
                  >
                    <NavLink
                      className={(navData) =>
                        navData.isActive ? 'active-style' : 'none'
                      }
                      style={{
                        textDecoration: 'none',
                        color: 'white',
                        fontSize: '18px',
                      }}
                      to={`/${page}`}
                    >
                      {page}
                    </NavLink>
                  </Button>
                ))}
              </Box>

              {/* <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                        <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                    ))}
                </Menu>
                </Box> */}
            </Toolbar>
          </Container>
        </AppBar>

        <div className="content">
          <Routes>
            <Route exact="true" path="/home" element={<Home />} />
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/confirm" element={<Confirm />} />
            <Route path="/passphrase" element={<Password />} />
            {/* </Route> */}
            {/* Private Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/download" element={<Download />} />
              <Route path="/folder/:foldername" element={<Upload />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </div>
  );
};
export default NavBar;
