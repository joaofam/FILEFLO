// External imports
import axios from 'axios';

// decryptPassphrase function
export const decryptPassphrase = async (privateKey, encryptedPassphrase) => {
  const data = {
    private_key: privateKey,
    encrypted_passphrase: encryptedPassphrase,
  };
  const requestConfig = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const url = 'http://localhost:5000/decrypt_passphrase';

  try {
    const response = await axios.post(url, data, requestConfig);
    return response.data;
  } catch (err) {
    console.error('Error decrypting passphrase:', err);
    return null;
  }
};
