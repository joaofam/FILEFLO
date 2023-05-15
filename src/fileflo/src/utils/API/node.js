// Extenal Dependancies
import axios from 'axios';

// function to handle file upload
export const uploadFile = (formData) => {
  return axios.post('http://localhost:8080/upload', formData);
};

// function to handle file deletion
export const deleteFile = (_name) => {
  return axios.delete(`http://localhost:8080/upload?name=\${_name}`);
};
