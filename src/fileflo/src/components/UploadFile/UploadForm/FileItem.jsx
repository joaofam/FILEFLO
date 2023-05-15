// Built-in Dependencies
import React from 'react';

// External Dependencies
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Material-UI Dependencies
import DeleteIcon from '@mui/icons-material/Delete';
import { Typography } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// Internal Dependencies
import '../../../utils/CSS/Container.css';

// FileItem Component
// Create and export the FileItem functional component
const FileItem = ({ file, deleteFile }) => {
  return (
    <>
      <li className="file-item" key={file.name}>
        {/* Display the UploadFileIcon */}
        <UploadFileIcon
          sx={{
            marginBottom: '-1px',
            marginLeft: '5px',
          }}
        />
        {/* Display the file name */}
        <Typography
          sx={{
            fontFamily: 'space-grotesk, monospace',
            fontSize: '16px',
            color: 'white',
            marginLeft: '-15px',
          }}
        >
          {file.name}
        </Typography>
        {/* Display the file actions */}
        <div className="actions">
          <div className="loading"></div>
          {/* Display the spinner icon if the file is uploading */}
          {file.isUploading && (
            <FontAwesomeIcon
              icon={faSpinner}
              className="fa-spin"
              onClick={() => deleteFile(file.name)}
            />
          )}
          {/* Display the delete icon if the file is not uploading */}
          {!file.isUploading && (
            <DeleteIcon
              sx={{
                marginBottom: '-8px',
                marginLeft: '40px',
              }}
              onClick={() => deleteFile(file.name)}
            />
          )}
        </div>
      </li>
    </>
  );
};

export default FileItem;
