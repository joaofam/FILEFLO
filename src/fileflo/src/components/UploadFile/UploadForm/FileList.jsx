// Built-in Dependencies
import React from 'react';

// Internal Dependencies
import FileItem from './FileItem';
import { deleteFile } from '../../../utils/API/node';

// FileList Component
const FileList = ({ files, removeFile }) => {

  // Delete file handler
  const deleteFileHandler = (_name) => {
    // Send delete request to server
    deleteFile(_name) // Use the utility function
      .then((res) => removeFile(_name))
      .catch((err) => console.error(err));
  };
  return (
    // Display the file list
    <ul className="file-list">
      {files &&
        files.map((f) => (
          <FileItem key={f.name} file={f} deleteFile={deleteFileHandler} />
        ))}
    </ul>
  );
};

export default FileList;
