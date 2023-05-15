// External imports
import axios from 'axios';

const encryptPassphrase = async (publicKey, hashedPassphrase) => {
  const data = {
    public_key: publicKey,
    hashed_passphrase: hashedPassphrase,
  };

  // requestPublicKeyAPIUrl API call
  try {
    const response = await axios.post('http://localhost:5000/encrypt_passphrase', data,  {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.encrypted_passphrase;
  } catch (error) {
    console.log('Error fetching encrypted passphrase:', error);
    return null;
  }
};

export { encryptPassphrase };
