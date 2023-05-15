// Built-in Dependencies
import * as React from 'react';

// Material-UI Dependencies
import Box from '@mui/material/Box';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// theme for typography
const theme = createTheme({
  typography: {
    fontFamily: 'Space-grtoesk, monospace',
    allVariants: {
      color: '#bebebe',
      fontSize: '22px',
    },
  },
});

// NoFile Component
const NoFile = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Typography>You currently do not have any files uploaded</Typography>
          <Typography>Begin by uploading a file</Typography>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default NoFile;
