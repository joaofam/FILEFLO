// Built-in Dependencies
import React, { useState } from 'react';

// External Dependencies
import { AiFillCrown } from 'react-icons/ai';

// Material-UI Dependencies
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import GroupsIcon from '@mui/icons-material/Groups';
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye';
import PersonIcon from '@mui/icons-material/Person';

// Internal Dependencies
import './HelpDrawer.css';

// HelpDrawer Component
const HelpDrawer = (props) => {
  // State Variables
  const [open, setOpen] = useState(false);

  // Custom Typography
  const CustomTypographyTitle = styled(Typography)(({ theme }) => ({
    color: '#fff',
    fontSize: '20px',
    fontFamily: 'space-grotesk, monospace',
    '& b': {
      fontWeight: 'bold',
      color: '#bf80ff',
    },
    '& underlineTitle': {
      fontWeight: 'bold',
      color: '#bf80ff',
      fontSize: '28px',
      marginLeft: '10%',
    },
    '& underline': {
      'text-decoration': 'underline',
      fontSize: '22px',
    },
    '& action': {
      fontSize: '16px',
    },
  }));

  return (
    <div>
      {/* Help Button */}
      <Button
        sx={{
          fontFamily: 'space-grotesk',
          color: 'gray',
          position: 'absolute',
          marginLeft: '61%',
          marginTop: '-10px',
          fontSize: '24px',
        }}
        onClick={() => setOpen(true)}
        className="help-button"
      >
        Help?
      </Button>
      <Drawer
        sx={{ width: '50% !important' }}
        open={open}
        anchor={'right'}
        onClose={() => setOpen(false)}
      >
        <CustomTypographyTitle>
          {' '}
          <underlineTitle> Stuck on What to do? </underlineTitle>
        </CustomTypographyTitle>
        <CustomTypographyTitle
          sx={{ paddingTop: '10px', paddingBottom: '10px' }}
        >
          {' '}
          <underline>Actions</underline>{' '}
        </CustomTypographyTitle>
        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <PersonIcon className="help-drawer-icon" />
          <CustomTypographyTitle>
            {' '}
            <action>
              {' '}
              Display the shared users of file or add a user to a file
            </action>{' '}
          </CustomTypographyTitle>
        </Box>

        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <DeleteIcon className="help-drawer-icon" />
          <CustomTypographyTitle>
            {' '}
            <action> Delete file permanently</action>{' '}
          </CustomTypographyTitle>
        </Box>

        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <DownloadIcon
            className="help-drawer-icon"
            sx={{ marginBottom: '-10px' }}
          />
          <CustomTypographyTitle>
            {' '}
            <action>
              {' '}
              Download file using passphrase - Beware action cannot be reverted{' '}
            </action>{' '}
          </CustomTypographyTitle>
        </Box>

        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <GroupsIcon
            className="help-drawer-icon"
            sx={{ marginBottom: '-10px' }}
          />
          <CustomTypographyTitle>
            {' '}
            <action>
              {' '}
              Displays all users within a folder, also has ability to add users
              to that folder
            </action>{' '}
          </CustomTypographyTitle>
        </Box>

        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <AiFillCrown
            className="help-drawer-icon"
            sx={{ marginBottom: '-20px' }}
          />
          <CustomTypographyTitle>
            {' '}
            <action> Owner of file</action>{' '}
          </CustomTypographyTitle>
        </Box>

        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <PanoramaFishEyeIcon
            className="help-drawer-icon"
            sx={{ marginBottom: '-10px' }}
          />
          <CustomTypographyTitle>
            {' '}
            <action>
              {' '}
              Users shared to file - All users have access to file{' '}
            </action>{' '}
          </CustomTypographyTitle>
        </Box>
        <CustomTypographyTitle>
          {' '}
          <underline> File Structure </underline>
        </CustomTypographyTitle>
        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CustomTypographyTitle>
            {' '}
            <action>
              {' '}
              ToDo: Add image containing a File and all information{' '}
            </action>{' '}
          </CustomTypographyTitle>
        </Box>
        <CustomTypographyTitle>
          {' '}
          <underline> How Fileflo works? </underline>
        </CustomTypographyTitle>
        <Box
          sx={{
            paddingBottom: '15px',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CustomTypographyTitle>
            <action>
              {' '}
              On information about how Fileflo operates and the hidden stuff
              please checkout our{' '}
              <Link
                href="/About"
                sx={{ color: '#9933ff', textDecorationColor: '#9933ff' }}
              >
                About
              </Link>{' '}
              page{' '}
            </action>
          </CustomTypographyTitle>
        </Box>
      </Drawer>
    </div>
  );
};

export default HelpDrawer;
