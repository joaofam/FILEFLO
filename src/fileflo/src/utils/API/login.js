// External dependencies
import axios from 'axios';

// Internal dependencies
import { requestConfig } from './requestConfig';

// loginUser function
export const loginUser = async (username, password) => {
  const requestBody = {
    username: username,
    password: password,
  };

  try {
    const url = 'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/login';
    const response = await axios.post(url, requestBody, requestConfig);
    return response.data;
  } catch (error) {
    throw error;
  }
};
