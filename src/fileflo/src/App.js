// External imports
import React, { 
    useState, 
    useEffect 
} from "react";
import { 
    BrowserRouter as Router, 
    Route,
    Routes,
    NavLink
} from "react-router-dom";
import "@fontsource/space-grotesk";
import axios from "axios"

// Material UI imports
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

// Internal imports
import './App.css'
import Home from "./pages/Home/Home";
import Upload from "./pages/Upload/Upload";
import Profile from "./pages/Profile/Profile";
import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Confirm from './pages/ConfirmSignUp/ConformSignUp'
import Password from './pages/Passphrase/Passphrase'
import About from './pages/About/About'
import PrivateRoute from "./routes/PrivateRoute";
import { 
    getUser, 
    getToken, 
    setUserSession, 
    resetUserSession 
} from "./service/AuthService";

// Page names
const pages = ['Home', 'Upload', 'About'];
const profile = ['Profile', 'Add account', 'Logout'];
// Profile links
const profileLinks = {
    'Profile': '/profile',
    'Add account': '/register',
    'Logout': '/login',
};

// Verify token API URL
const verifyTokenAPIURL = 'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/verify';

// App component
const App= () => {
    // State variables
    const [isAuthenicating, setAuthenicating] = useState(true);
    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [username, setUsername] = useState('');

    // Get user from session storage
    const user = getUser();
    
    // Set username
    useEffect(() => { 
        if (user) { 
            setUsername(user.username);
        }
    }, [user]);

    // Verify token
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
        // Request config
        const requestConfig = {
            headers: {
                'x-api-key': 'mOZT1CQkd09PPTwCJ32Hp7qFhNrZPr2F65HMP0Fm'
            }
        }
        const requestBody = {
            user: getUser(),
            token: token
        }
        // Verify token API call
        axios.post(verifyTokenAPIURL, requestBody, requestConfig)
        .then(response => {
            setUserSession(response.data.user, response.data.token);
            setAuthenicating(false);
        }).catch(() => {
            resetUserSession();
            setAuthenicating(false);
        })
    }, []);

    // If user is not authenticated and token is present, show loading
    const token = getToken();
    if (isAuthenicating && token) {
        return <div className="content">...</div>
    }

    // Navigation menu handlers
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    // Profile menu handlers
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div className="App">
            <Router>
                <AppBar position="static" sx={{background: "#2f3031"}}> 
                    <Container maxWidth="xl">
                        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                            {/* Logo */}
                            <Box
                                className="logo-box"
                                component="img"
                                sx={{ width: 40 }}
                                alt="fileflo"
                                src={require("./assets/filefloicon-removebg-preview.png")}
                            />
                            {/* Logo title */}
                            <Typography
                                className="logo-title"
                                variant="h6"
                                noWrap
                                component="a"
                                href="/"
                                sx={{
                                    fontFamily: "space-grotesk monospace",
                                    color: "inherit",
                                    overflow: "visible",
                                    textDecoration: "none",
                                    fontSize: "24px",
                                    "@media (maxWidth: 600px)": {
                                        fontSize: "1.2rem",
                                    }
                                }}
                            >
                                FILEFLO
                            </Typography>
                            {/* Navigation Menu */}
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
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                    keepMounted
                                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    open={Boolean(anchorElNav)}
                                    onClose={handleCloseNavMenu}
                                    sx={{ display: { xs: 'block', md: 'none' } }}
                                >
                                    { /* Mapped Pages */}
                                    {pages.map((page) => (
                                        <MenuItem key={page} onClick={handleCloseNavMenu}>
                                            <Typography textAlign="center">
                                                <NavLink
                                                    className={(navData) => (navData.isActive ? "active-style" : 'none')}
                                                    style={{
                                                        marginRight: "22px",
                                                        color: "white",
                                                        fontSize: "18px",
                                                        fontFamily: 'space-grotesk '
                                                    }}
                                                    exact="true"
                                                    to={`/${page === "Upload" ? "folder/Personal" : page}`}
                                                >
                                                    {page}
                                                </NavLink>
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                            {/* Navigation Menu */}
                            <AdbIcon sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                            <Typography
                                variant="h5"
                                noWrap
                                component="a"
                                href=""
                                sx={{
                                    mr: 2,
                                    display: { xs: 'flex', md: 'none' },
                                    flexGrow: 1,
                                    fontWeight: 700,
                                    letterSpacing: '.3rem',
                                    color: 'inherit',
                                    textDecoration: 'none',
                                    fontFamily: 'space-grotesk'
                                }}
                            >
                                LOGO
                            </Typography>
                            {/* Navigation Links */}
                            <Box sx={{ 
                                    width: "71%",
                                    marginLeft: "-1%",   
                                    flexGrow: 1.5, 
                                    display: { xs: 'none', md: 'flex' } ,
                                }}
                            >
                                {pages.map((page) => (
                                    <Button
                                        key={page}
                                        onClick={handleCloseNavMenu}
                                        sx={{ 
                                            marginRight: "67px",
                                            ':hover': {
                                                bgcolor: '#9933ff',
                                                opacity: "75%", // theme.palette.primary.main
                                                borderRadius: "10px",},
                                            my: 2, 
                                            color: 'white', 
                                            display: 'block',
                                            fontFamily: "space-grotesk monospace",
                                            }}
                                    >
                                        <NavLink 
                                            className="main-nav" 
                                            style={{
                                                ':hover': {
                                                    color: 'black',
                                                    },
                                                textDecoration: "none",
                                                marginLeft: "0px", 
                                                color:"white", 
                                                fontSize: "22px",
                                                    "@media (maxWidth: 600px)": {
                                                        fontSize: "1.2rem",
                                                    } 
                                                }} 
                                            to={`/${page === "Upload" ? "folder/Personal" : page}`}
                                        >
                                            {page}
                                        </NavLink>
                                    </Button>
                                ))}
                            </Box>
                            {/* Profile Menu */}
                            <Box sx={{ 
                                textAlign: "center", 
                                marginRight: "-9%", 
                                flexGrow: 0, 
                                display: { xs: 'none', md: 'flex' } 
                                }}
                            >
                                <Button
                                    onClick={handleClick}
                                    sx={{
                                        my: 2,
                                        color: 'white',
                                        display: 'block',
                                        fontFamily: 'space-grotesk monospace',
                                    }}
                                >
                                    {username ? username : "Profile"}
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={Boolean(anchorEl)}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    {profile.map((page) => (
                                        <MenuItem sx={{fontSize: "22px"}} key={page} onClick={handleClose}>
                                            <NavLink
                                                className={(navData) => (navData.isActive ? 'active-style' : 'none')}
                                                style={{
                                                    textDecoration: 'none',
                                                    color: 'white',
                                                    fontSize: '18px',
                                                    '@media (maxWidth: 600px)': {
                                                    fontSize: '1.2rem',
                                                    },
                                                }}
                                                to={profileLinks[page]}
                                            >
                                                {page}
                                            </NavLink>
                                        </MenuItem>
                                    ))}
                                </Menu>
                            </Box>
                        </Toolbar>
                    </Container>
                </AppBar>
                {/* Routes */}
                <div className="content">
                    <Routes>
                        <Route exact="true" path="/home" element={<Home />}/>
                        {/* Public Routes */}
                        <Route path='/login' element={<Login/>} />  
                        <Route path='/register' element={<Register/>} />
                        <Route path="/confirm" element={<Confirm />}/>
                        <Route path="/passphrase" element={<Password />}/>
                        <Route path="/about" element={<About />}/>
                        {/* Private Routes */}
                        <Route element={<PrivateRoute/>}>
                        <Route path="/profile" element={<Profile />}/>
                        <Route path="/upload" element={<Upload />}/>
                        <Route path='/folder/:foldername' element={<Upload/>} />
                        <Route path='/about' element={<About/>} />
                        </Route>
                    </Routes>
                </div>
            </Router>
        </div>
    );
}
export default App;