// Built-in dependencies
import React from 'react';

// Extenal dependencies
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';

// Internal dependencies
import './Home.css';

// Custom Paper component with styling
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === '#2f3031',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));
// Home component
export default function Home() {
  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '15px',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'space-grotesk',
            fontSize: '38px',
            display: 'flex',
            alignItems: 'center',
            color: '#bebebe',
          }}
        >
          Welcome to
        </Typography>
        <Typography
          sx={{
            fontFamily: 'space-grotesk, monospace',
            fontSize: '50px',
          }}
        >
          <img
            className="form-logo-home"
            alt="fileflo-home"
            src={require('../../assets/filefloicon-removebg-preview.png')}
            style={{ marginLeft: '8px', marginRight: '8px' }}
          />
          FILEFLO
        </Typography>
        <Typography
          sx={{
            fontFamily: 'space-grotesk, monospace',
            fontSize: '24px',
            color: '#bebebe',
          }}
        >
          Current Version v1.00
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'space-grotesk, monospace',
            fontSize: '26px',
            color: '#bebebe',
            textDecoration: 'underline',
            textDecorationColor: '#9933ff',
            paddingBottom: '20px',
          }}
        >
          Current explorable features + many more
        </Typography>
      </Box>
      <Box
        sx={{
          width: '85%',
          display: 'flex',
          mx: 'auto',
          my: 'auto',
          paddingBottom: '40px',
        }}
      >
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {/* first grid */}
          <Grid item xs={6}>
            <Item className="item-background">
              <Typography className="item-text">
                Dashboard to control all your files
              </Typography>
              <img
                className="screenshots"
                alt="fileflo-upload-page"
                src={require('../../assets/upload-page-screenshot.png')}
              />
            </Item>
          </Grid>
          {/* second grid */}
          <Grid item xs={6}>
            <Item className="item-background">
              <Typography className="item-text">
                Upload at maximum safety
              </Typography>
              <img
                className="screenshots"
                alt="fileflo-upload"
                src={require('../../assets/upload-screenshot.png')}
              />
            </Item>
          </Grid>
          {/* third grid */}
          <Grid item xs={6} className="grid">
            <Item className="item-background">
              <Typography className="item-text">
                Share a file with any other Fileflo user(s)
              </Typography>
              <img
                className="screenshots"
                alt="fileflo-shared"
                src={require('../../assets/shared-screenshot.png')}
              />
            </Item>
          </Grid>
          {/* fourth grid */}
          <Grid item xs={6}>
            <Item className="item-background">
              <Typography className="item-text">
                Manage your files in organized Folders
              </Typography>
              <img
                className="screenshots"
                alt="fileflo"
                src={require('../../assets/folder-screenshot.png')}
              />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
