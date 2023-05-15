// Built-in Dependencies
import React from 'react';

// Material-UI Dependencies
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import { Typography } from '@mui/material';

// Trigger Component
const Trigger = ({
  triggerText,
  buttonRef,
  showModal,
  hoveredFileId,
  FileId,
}) => {
  return (
    <Tooltip
      sx={{ fontFamily: 'space-grotesk' }}
      title={
        <Typography sx={{ fontSize: '12px', fontFamily: 'space-grotesk' }}>
          Download
        </Typography>
      }
      placement="top"
    >
      <DownloadIcon
        sx={{
          cursor: 'pointer',
          opacity: hoveredFileId === FileId ? 1 : 0,
          transition: 'opacity 0.2s ease-in-out',
        }}
        className="btn btn-lg btn-danger center modal-button"
        ref={buttonRef}
        onClick={showModal}
      >
        {triggerText}
      </DownloadIcon>
    </Tooltip>
  );
};
export default Trigger;
