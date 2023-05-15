// External imports
import axios from 'axios';

// decryptFile function
export const decryptFile = async (finalPassphrase, fileType) => {
    const formData = new FormData();
    formData.append('passphrase', finalPassphrase);
    formData.append('file_type', fileType);
    
    // requestConfig
    const requestConfig = {
      responseType: 'arraybuffer', // specify the response type as an array buffer
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    // decryptFile API call
    const url = 'http://localhost:5000/decrypt';
    
    try {
      const response = await axios.post(url, formData, requestConfig);
      return response;
    } catch (err) {
      console.error('Error decrypting file:', err);
      return null;
    }
};