// External imports
import axios from 'axios';

// postEncryptedFile function
export const postEncryptedFile = async (file, encryptedPassphrase) => {
  // formData
const formData = new FormData();
  formData.append('file', file);
  formData.append('passphrase', encryptedPassphrase);

  // postEncryptedFile API call
  const url = 'http://localhost:5000/encrypt';
  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting encrypted file:', error);
    return null;
  }
};
