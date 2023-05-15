// External imports
import axios from 'axios';

// folderPassphraseAPIUrl
const folderPassphraseAPIUrl =
  'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/folderpassphrase';

// submitFolderPassphrase function
const submitFolderPassphrase = async (
  username,
  owner,
  folder,
  folderPassphrase,
  createFolder,
  setErrorMessage
) => {
  try {
    const requestConfig = {
      headers: {
        'x-api-key': 'mOZT1CQkd09PPTwCJ32Hp7qFhNrZPr2F65HMP0Fm',
      },
    };
    // request body
    const requestBody = {
      username: username,
      folder: folder.replace(/\s+/g, '-'),
      passphrase: folderPassphrase,
      owner: owner,
    };
    // folderPassphraseAPIUrl API call
    await axios
      .post(folderPassphraseAPIUrl, requestBody, requestConfig)
      .then((response) => {
        if (createFolder) {
          // If the createFolder flag is true, then create the folder
          createFolder();
        }
      })
      .catch((error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          // If the user is not authenticated, then display an error message
          setErrorMessage(error.response.data.message);
        } else {
          // If the backend server fails, then display an error message
          setErrorMessage(
            'Sorry....the backend server is down. Please try again later!!'
          );
        }
      });
  } catch (err) {
    console.log('error submitting form:', err);
  }
};

export default submitFolderPassphrase;
