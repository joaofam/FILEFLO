// External imports
import axios from 'axios';


export const encryptPassphrase = async (publicKey, hashedPassphrase) => {
  const data = {
    public_key: publicKey,
    hashed_passphrase: hashedPassphrase,
  };
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // encryptPassphrase API call
  const url = 'http://localhost:5000/encrypt_passphrase';
  try {
    const response = await axios.post(url, data, config);
    return response.data;
  } catch (err) {
    console.error('Error encrypting passphrase:', err);
    return null;
  }
};
