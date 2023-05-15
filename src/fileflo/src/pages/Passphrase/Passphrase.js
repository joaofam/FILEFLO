// External Imports
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BiMale } from 'react-icons/bi';
// Material UI imports
import { Typography } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Button from '@mui/material/Button';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
// Internal imports
import '../Login/login.css';
import kms from '../../utils/AWS/kms';

// passphrase API endpoint
const passphraseUrl =
  'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/passphrase';

const schema = z.object({
  passphrase: z.string(),
});

// Passphrase component
const Passphrase = () => {
  const username = localStorage.getItem('username');

  // Form state and methods
  const { register, handleSubmit, formState } = useForm({
    resolver: zodResolver(schema),
  });

  // State variables
  const [passphrase, setPassphrase] = useState('');
  const [message, setMessage] = useState(null);
  const [, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCopy, setOpenCopy] = React.useState(false);
  const { isSubmitting } = formState;
  const textRef = useRef(null);

  // Function to encrypt the private key using KMS
  async function encryptPrivateKey(privateKey, kms) {
    const params = {
      KeyId: '7cf3bf37-05ee-494c-92bc-1b71a8d52703',
      Plaintext: privateKey,
    };

    return new Promise((resolve, reject) => {
      kms.encrypt(params, (err, data) => {
        if (err) {
          console.error('Error encrypting the private key:', err);
          reject(err);
        } else {
          const encryptedPrivateKey = data.CiphertextBlob.toString('base64');
          resolve(encryptedPrivateKey);
        }
      });
    });
  }

  // Handle form submission
  const formSubmit = async () => {
    if (passphrase.trim() === '') {
      setMessage('All fields are required');
      return;
    }

    const response = await axios.get('http://localhost:5000/generate_keys');
    const keys = await response.data;

    setMessage(null);
    const requestConfig = {
      headers: {
        'x-api-key': 'mOZT1CQkd09PPTwCJ32Hp7qFhNrZPr2F65HMP0Fm',
      },
    };

    // Call the encryptPrivateKey function
    const encryptedPrivateKey = await encryptPrivateKey(keys.private_key, kms);

    const requestBody = {
      username: username,
      passphrase: passphrase,
      publicKey: keys.public_key,
      privateKey: encryptedPrivateKey,
    };
    // Make a POST request to the passphrase API endpoint
    axios
      .post(passphraseUrl, requestBody, requestConfig)
      .then((response) => {
        setMessage('Registration Successful!');
        // Set the public and private keys
        setPublicKey(keys.public_key);
        setPrivateKey(keys.private_key);
        // Clear the local storage
        localStorage.clear();
      })
      // Catch any errors and set the error message
      .catch((error) => {
        if (error.response.status === 401) {
          setMessage(error.response.data.message);
        } else {
          setMessage(
            'Sorry, the backend server is down. Please try again later.'
          );
        }
      });
  };

  // Popover
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  // Handle click for popover
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle close for popover
  const handleClose = () => {
    setAnchorEl(null);
  };

  // Copy to clipboard
  const copyToClipboard = () => {
    setOpenCopy(true);
    if (textRef.current) {
      navigator.clipboard.writeText(textRef.current.textContent);
    }
  };

  // Handle close for Snackbar
  const handleCopyClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenCopy(false);
  };

  // Define actions for Snackbar
  const action = (
    <React.Fragment>
      <Button
        sx={{
          width: '50% !important',
          fontSize: '12px !important',
          fontWeight: 'normal !important',
          textDecoration: 'none !important',
        }}
        color="secondary"
        size="small"
        onClick={handleCopyClose}
      >
        UNDO
      </Button>
      <IconButton
        sx={{ width: '50% !important' }}
        size="small"
        aria-label="close"
        onClick={handleCopyClose}
      >
        <Typography sx={{ fontSize: '12px' }}>Close</Typography>
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <div className="login-block">
        <form onSubmit={handleSubmit(formSubmit)}>
          {/* Logo */}
          <img
            className="form-logo"
            alt="fileflo"
            src={require('../../assets/filefloicon-removebg-preview.png')}
          />
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator=">"
            aria-label="breadcrumb"
            sx={{
              '& ol': {
                justifyContent: 'center',
                margin: 'auto',
                color: 'purple',
                fontSixe: '14px',
                paddingBottom: 1.5,
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: 'space-grotesk, monospace',
                color: '#7f7f7f',
              }}
            >
              Register
            </Typography>
            <Typography
              sx={{
                fontFamily: 'space-grotesk, monospace',
                color: '#7f7f7f',
              }}
            >
              Confirm
            </Typography>
            <Link sx={{ color: 'White' }} underline="hover" color="inherit">
              Passphrase
            </Link>
          </Breadcrumbs>
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
            Passphrase
          </Typography>
          {/* Passphrase requirements */}
          <Typography
            sx={{
              fontFamily: 'space-grotesk, monospace',
              color: '#bebebe',
              fontSize: '12px',
              paddingLeft: '12px',
              paddingBottom: '8px',
            }}
          >
            Please enter a valid passphrase that contains:
          </Typography>
          <Typography
            sx={{
              fontFamily: 'space-grotesk, monospace',
              color: '#bebebe',
              fontSize: '12px',
              paddingLeft: '12px',
              paddingBottom: '2px',
            }}
          >
            • at least 4 words
          </Typography>
          <Typography
            sx={{
              fontFamily: 'space-grotesk, monospace',
              color: '#bebebe',
              fontSize: '12px',
              paddingLeft: '12px',
              paddingBottom: '10px',
            }}
          >
            • at least 3 characters each
          </Typography>
          <WarningIcon
            sx={{
              position: 'absolute',
              fontSize: 20,
            }}
          />
          {/* Save passphrase message*/}
          <Typography
            sx={{
              fontFamily: 'space-grotesk, monospace',
              color: '#bebebe',
              fontSize: '12px',
              paddingLeft: '33px',
              paddingBottom: '8px',
            }}
          >
            IMPORTANT: Remember or save your passphrase because after you have
            created a passphrase you will no longer be able to retrieve it.
          </Typography>
          {/* Passphrase input */}
          <label className="label">passphrase</label>
          <div className="input-container">
            <BiMale className="icon" />
            <input
              {...register('passphrase')}
              type="text"
              name="passphrase"
              value={passphrase}
              onChange={(data) => setPassphrase(data.target.value)}
              placeholder="passphrase"
            />
          </div>
          {message && (
            <Typography
              sx={{
                textAlign: 'center',
                padding: '5px',
                fontSize: '18px',
                fontFamily: 'space-grotesk, monospace',
                color: '#bebebe',
              }}
            >
              {message}
            </Typography>
          )}
          {/* Private key */}
          {!privateKey ? (
            <button
              type="submit"
              value="Register"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              Create passphrase
            </button>
          ) : (
            <Box
              style={{
                border: '1px solid #262626',
                borderRadius: '5px',
                width: '100%',
                backgroundColor: '#404040',
                wordWrap: 'break-word',
                padding: '10px',
                paddingTop: '20px',
              }}
            >
              <Typography
                sx={{
                  padding: '10px',
                  fontFamily: 'space-grotesk, monospace',
                  fontSize: '14px',
                }}
              >
                Here is your private key. Please copy and paste it somewhere as
                it will be needed in uploading and downloading:
              </Typography>
              <Button
                sx={{ color: 'white' }}
                aria-describedby={id}
                variant="contained"
                onClick={handleClick}
              >
                Check Private Key
              </Button>
              <Popover
                sx={{
                  color: 'blue',
                  width: '25%',
                  maxWidth: '40%',
                }}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
              >
                <ContentCopyIcon
                  sx={{
                    color: 'gray',
                    cursor: 'pointer',
                    position: 'absolute',
                    marginTop: '10px',
                  }}
                  onClick={copyToClipboard}
                ></ContentCopyIcon>
                <Typography
                  ref={textRef}
                  sx={{
                    p: 2,
                    fontFamily: 'space-grotesk, monospace',
                    paddingTop: '30px',
                    fontSize: '12px',
                    color: '#bebebe',
                    backgroundColor: '#333333',
                    overflow: 'hidden',
                    maxWidth: '100%', // Set the maxWidth to 100%
                    wordWrap: 'break-word', // Ensure the text wraps to the next line
                  }}
                >
                  {privateKey}
                </Typography>
              </Popover>
            </Box>
          )}
          {!privateKey ? null : (
            <Typography
              sx={{
                textAlign: 'center',
                padding: '5px',
                fontSize: '14px',
                fontFamily: 'space-grotesk, monospace',
                color: 'gray',
              }}
            >
              {' '}
              Private key copied? Proceed to{' '}
              <Link sx={{ color: '#9933ff' }} href="/login">
                Login
              </Link>{' '}
            </Typography>
          )}
        </form>
        <Snackbar
          open={openCopy}
          autoHideDuration={6000}
          onClose={handleCopyClose}
          message="Copied to Clipboard"
          action={action}
        />
      </div>
    </div>
  );
};

export default Passphrase;
