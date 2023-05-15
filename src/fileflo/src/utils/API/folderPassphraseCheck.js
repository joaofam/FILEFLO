// External imports
import axios from 'axios';
// Internal imports
import { requestConfig } from './requestConfig';

// folderPassphraseCheckAPIUrl
const folderPassphraseCheckAPIUrl =
  'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/folderpassphrasecheck';

const folderPassphraseCheck = async (username, folder, passphrase) => {

  // request body
  const requestBody = {
    username: username,
    passphrase: passphrase,
    folder: folder,
  };
  try {
    // folderPassphraseCheckAPIUrl API call
    const response = await axios.post(
      folderPassphraseCheckAPIUrl,
      requestBody,
      requestConfig
    );
    console.log(response);
    // Return the response data
    return response.data;
  } catch (err) {
    console.log(err);
    // Return the error message
    return { error: err.response.data.message }; // Return the error message as part of an object
  }
};

export { folderPassphraseCheck };
