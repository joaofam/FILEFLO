// Built-in dependencies
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// External imports
import { setUserSession, resetUserSession } from '../../service/AuthService';
import { BiError, BiUser, BiLockAlt } from 'react-icons/bi';
import { Auth } from 'aws-amplify';

// Material UI
import { Typography } from '@mui/material';
import Link from '@mui/material/Link';

// Internal imports
import './login.css';
import { loginUser } from '../../utils/API/login';

// Login component
const Login = (props) => {
  // Reset the user session
  resetUserSession();

  // State variables
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  // Submit handler for the login form
  const submitHandler = async (event) => {
    event.preventDefault();

    // Check if both username and password are provided
    if (username.trim() === '' || password.trim() === '') {
      setErrorMessage('Both username and password are required');
      return;
    }

    // Clear error message
    setErrorMessage(null);

    // login API call
    try {
      const response = await loginUser(username, password);
      setUserSession(response.user, response.token);
      navigate('/Home');
    } catch (error) {
      // Handle API errors
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage(
          'Sorry....the backend server is down. Please try again later!!'
        );
      }
    }

    // Authenticate with AWS Amplify
    try {
      await Auth.signIn(username, password);
    } catch (error) {
      console.log('error signing in', error);
    }
  };

  return (
    <div>
      <div className="logo"></div>
      <div className="login-block">
        {/* Login form */}
        <form onSubmit={submitHandler}>
          {/* Logo */}
          <img
            className="form-logo"
            alt="fileflo"
            src={require('../../assets/filefloicon-removebg-preview.png')}
          />
          {/* Sign In title */}
          <Typography
            sx={{
              fontFamily: 'space-grotesk, monospace',
              color: 'white',
              fontSize: '20px',
              textAlign: 'center',
              paddingBottom: '8px',
              fontWeight: 'bold',
            }}
          >
            Sign In
          </Typography>
          {/* Username input */}
          <label htmlFor="username-input" className="label">Username</label>
          <div className="input-container">
            <BiUser className="icon" />
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              id="username-input"
              placeholder="Name of user"
            />
          </div>
          {/* Password input */}
          <label  htmlFor="password-input" className="label">Password</label>
          <div className="input-container">
            <BiLockAlt className="icon" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              id="password-input"
              placeholder="Something secretive"
            />
          </div>
          {/* Login button */}
          <button type="submit" value="Login">
            Login
          </button>
        </form>
        {/* Register link */}
        <Typography
          sx={{
            fontFamily: 'space-grotesk, monospace',
            color: '#bebebe',
            fontSize: '12px',
            textAlign: 'center',
            paddingTop: '14px',
          }}
        >
          Don't have an account?{' '}
          <Link
            href="/register"
            sx={{ color: 'white', textDecorationColor: '#bebebe' }}
          >
            Create an account
          </Link>
        </Typography>
        {/* Error message */}
        {errorMessage && (
          <p className="errorResponse">
            <BiError />
            {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
