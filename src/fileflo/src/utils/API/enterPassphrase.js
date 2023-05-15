// External imports
import axios from 'axios';
// Internal imports
import { getUser } from '../../service/AuthService';
import { requestConfig } from './requestConfig';

// confirmPassphraseAPIUrl
const confirmPassphraseAPIUrl = 'https://s41eemifi8.execute-api.eu-west-1.amazonaws.com/prod/confirmpass';

// enterPassphrase check function
const enterPassphrase = async (passphrase) => {

    // Get the user
    const user = getUser();

    // request body
    const requestBody = {
        username: user.username,
        passphrase: passphrase
    }
    // confirmPassphraseAPIUrl API call
    try {
        const response = await axios.post(confirmPassphraseAPIUrl, requestBody, requestConfig);
        console.log(response);
        sessionStorage.setItem('personalPassphrase', passphrase);
    } catch (err) {
    console.log(err);
        return err.response.data.message;
    }
}

export { enterPassphrase };