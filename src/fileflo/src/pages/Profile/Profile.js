// Built-in dependencies
import React from 'react';

// Material UI components
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

// Internal dependencies
import { useLogout } from '../../utils/Logout';
import { getUser } from '../../service/AuthService';
import './Profile.css';

const useStyles = styled((theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
  },
  userInfo: {
    marginBottom: theme.spacing(2),
  },
}));

const Profile = (props) => {
  const classes = useStyles();
  const user = getUser();
  const name = user !== 'undefined' && user ? user.name : '';

  const logoutHandler = useLogout();

  return (
    <Container className={classes.container}>
      <Typography sx={{fontFamily: "space-grotesk", fontSize: "48px"}}>
        Hello {name}!
      </Typography>
      <Typography sx={{fontFamily: "space-grotesk", fontSize: "28px"}}>
        You have been logged in! Welcome to your profile page.
      </Typography>
      {user.username && (
        <Typography sx={{fontFamily: "space-grotesk", fontSize: "28px"}}>
          Username: {user.username}
        </Typography>
      )}
      {user.email && (
        <Typography sx={{fontFamily: "space-grotesk", fontSize: "28px"}}>
          Email: {user.email}
        </Typography>
      )}
      <Box sx={{paddingTop: "10px"}}>
        <Button className='logout-button' onClick={logoutHandler}>
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Profile;
