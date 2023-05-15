// Built-in dependencies
import React, { useState } from 'react';

// External dependencies
import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';
import { BiError, BiCode } from 'react-icons/bi';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

// Internal dependencies
import '../Login/login.css';

// Set the initial state
const initialFormState = { code: '' };

// ConfirmSignup component
const ConfirmSignup = () => {
  // State variables
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState(null);

  // Get the navigate function from react-router-dom
  const navigate = useNavigate();

  // Get the username from local storage
  const username = localStorage.getItem('username');
  localStorage.setItem('username', username);

  // Get the verification code from the form data
  const code = formData.code;

  // Define the submit handler function
  const submitHandler = async (event) => {
    event.preventDefault();

    // Check if the verification code is empty
    if (code.trim() === '') {
      setErrorMessage('Please enter the verification code');
      return;
    }
    // Reset the error message
    setErrorMessage(null);
    // Call the confirmSignUp function
    if (code.trim() !== '') {
      confirmSignUp();
    }
    // Define the confirmSignUp function
    async function confirmSignUp() {
      try {
        await Auth.confirmSignUp(username, code);
        navigate('/passphrase', { replace: true });
      } catch (error) {
        setErrorMessage('Invalid Verification Code');
      }
    }
  };

  // Component styles
  const styles = {
    breadcrumbs: {
      '& ol': {
        justifyContent: 'center',
        margin: 'auto',
        color: 'purple',
        fontSize: '14px',
        paddingBottom: 1.5,
      },
    },
    typography: {
      fontFamily: 'space-grotesk, monospace',
      color: '#7f7f7f',
    },
    confirmTypography: {
      fontFamily: 'space-grotesk, monospace',
      color: 'white',
      fontSize: '20px',
      textAlign: 'center',
      paddingBottom: '8px',
      fontWeight: 'bold',
    },
  };

  return (
    <div>
      <div className="logo">
        <div className="login-block">
          <form onSubmit={submitHandler}>
            <img
              className="form-logo"
              alt="fileflo"
              src={require('../../assets/filefloicon-removebg-preview.png')}
            />
            <Breadcrumbs
              separator=">"
              aria-label="breadcrumb"
              sx={styles.breadcrumbs}
            >
              <Typography sx={styles.typography}>Register</Typography>
              <Link sx={{ color: 'White' }} underline="hover" color="inherit">
                Confirm
              </Link>
              <Typography sx={styles.typography}>Passphrase</Typography>
            </Breadcrumbs>
            <Typography sx={styles.confirmTypography}>
              Confirm Verification Code
            </Typography>
            <div className="grid max-w-screen-xl h-screen text-black m-auto place-content-center">
              <div className="w-[30rem] space-y-6">
                <label className="label">Enter the confirmation</label>
                <div className="input-container">
                  <BiCode className="icon" />
                  <input
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="code"
                    value={formData.code}
                    type="text"
                  />
                </div>
              </div>
              <button type="submit" value="Login">
                Login
              </button>
            </div>
          </form>
          {errorMessage && (
            <p className="errorResponse">
              <BiError />
              {errorMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmSignup;
