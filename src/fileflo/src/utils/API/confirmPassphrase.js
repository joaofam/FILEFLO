// External Dependencies
import axios from 'axios';

// Internal Dependencies
import { requestConfig } from './requestConfig';

export const confirmPassphrase = async (username, passphrase) => {
  const requestBody = {
    username: username,
    passphrase: passphrase,
  };

  // confirmPassphraseAPIUrl API call
  const url =
  'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/confirmpass';

  try {
    const response = await axios.post(url, requestBody, requestConfig);
    return response;
  } catch (err) {
    console.error('Error confirming passphrase:', err);
    return null;
  }
};
