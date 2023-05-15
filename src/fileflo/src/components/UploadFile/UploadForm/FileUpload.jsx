// Built-in Dependencies
import React from 'react';

// Material-UI Dependencies
import UploadIcon from '@mui/icons-material/Upload';

// Internal Dependencies
import '../../../utils/CSS/Container.css';
import { uploadFile } from '../../../utils/API/node'

// FileUpload Component
const FileUpload = ({ id, files, setFiles, removeFile, file }) => {
  // Upload handler
  const uploadHandler = (event) => {
    const file = event.target.files[0];

    // Check if file is selected
    if (!file) return;
    file.isUploading = true;
    setFiles([...files, file]);

    // Upload file
    const formData = new FormData();
    formData.append('newFile', file, file.name);

    // Send post request to server
    uploadFile(formData)
      .then((res) => {
        file.isUploading = false;
        setFiles([...files, file]);
      })
      .catch((err) => {
        // inform the user
        console.error(err);
        removeFile(file.name);
      });
  };

  // Render FileUpload
  return (
    <div className="file-card">
      <div className="file-inputs">
        <input className="upload-input" type="file" id={id} onChange={uploadHandler} />
        <button className="upload-button">
          {/* Display the UploadIcon */}
          <i>
            <UploadIcon
              sx={{
                fontSize: '2.25rem !important',
                marginLeft: '16px',
                width: '250% !important',
              }}
            />
          </i>
          Browse
        </button>
      </div>
      {/* Display the file name */}
      <p className="main">Supported file types:</p>
      <p className="info">PDF, JPG, PNG, etc</p>
    </div>
  );
};

export default FileUpload;
