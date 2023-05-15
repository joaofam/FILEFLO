// External imports
import axios from 'axios';

// Internal imports
import { requestConfig } from './requestConfig';

// retrieveUserPublicKeyAPI function
export const retrieveUserPublicKeyAPI = async (username) => {
  // request body
  const requestBody = {
    headers: {
      requestConfig
    },
    params: {
      username: username,
    },
  };

  // GET request
  const url = 'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/retrieveuserpublickeypath';
  try {
    const response = await axios.get(url, requestBody);
    return response.data;
  } catch (err) {
    console.error('Error retrieving user public key:', err);
    return null;
  }
};
