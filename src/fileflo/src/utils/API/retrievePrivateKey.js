// External Dependencies
import axios from "axios";

// Internal Dependencies
import { requestConfig } from "./requestConfig";

// retrievePrivateKeyAPI function
export const retrievePrivateKeyAPI = async (username) => {
    // request body
    const requestBody = {
      username: username,
    };
    const retrievePrivateKeyAPIURL =
      'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/retrieveuserprivatekey';
  
    try {
      const response = await axios.post(
        retrievePrivateKeyAPIURL,
        requestBody,
        requestConfig
      );
      return response.data.privateKey;
    } catch (err) {
      console.error('Error retrieving user private key:', err);
      return null;
    }
};