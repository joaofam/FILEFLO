const registerService = require('./lambda/services/services/register');
const loginService = require('./lambda/services/services/login');
const verifyService = require('./lambda/services/services/verify');
const passphraseService = require('./lambda/services/services/passphrase');
const confirmPassService = require('./lambda/services/services/confirmPass');
const folderPassphraseService = require('./lambda/services/services/folderPassphrase');
const retrieveUserPublicKeyService = require('./lambda/services/services/retrieveUserPublicKey');
const storeprivatekeyService = require('./lambda/services/services/storeprivatekey');
const retrieveUserPrivateKeyService = require('./lambda/services/services/retrieveUserPrivateKey');
const folderPassphraseCheckService = require('./lambda/services/services/folderPassphraseCheck');

const util = require('./utils/util');

const healthPath = '/health';
const registerPath = '/register';
const loginPath = '/login';
const verifyPath = '/verify';
const passphrasePath = '/passphrase';
const confirmPassPath = '/confirmpass';
const folderPassphrasePath = '/folderpassphrase';
const retrieveUserPublicKeyPath = '/retrieveuserpublickeypath';
const storeprivatekeyPath = '/storeprivatekey';
const retrieveUserPrivateKeyPath = '/retrieveuserprivatekey';
const folderPassphraseCheckPath = '/folderpassphrasecheck';

exports.handler = async (event) => {
    console.log('Request Event: ', event);
    let response;
    switch(true){
        // Health
        case event.httpMethod === 'GET' && event.path === healthPath:
            response = util.buildResponse(200);
            break;
        // Register
        case event.httpMethod === 'POST' && event.path === registerPath:
            const registerBody = JSON.parse(event.body);
            response = await registerService.register(registerBody);
            break;
        // Login
        case event.httpMethod === 'POST' && event.path === loginPath:
            const loginBody = JSON.parse(event.body);
            response = await loginService.login(loginBody);
            break;
        // Verify
        case event.httpMethod === 'POST' && event.path === verifyPath:
            const verifyBody = JSON.parse(event.body);
            response = await verifyService.verify(verifyBody);
            break;
        // Passphrase
        case event.httpMethod === 'POST' && event.path === passphrasePath:
            const passphraseBody = JSON.parse(event.body);
            response = await passphraseService.passphrase(passphraseBody);
            break;
        // Confirm passphrase
        case event.httpMethod === 'POST' && event.path === confirmPassPath:
            const confirmPassBody = JSON.parse(event.body);
            response = await confirmPassService.confirmPass(confirmPassBody);
            break;
        // Folder passphrase
        case event.httpMethod === 'POST' && event.path === folderPassphrasePath:
            const folderPassphraseBody = JSON.parse(event.body);
            response = await folderPassphraseService.folderPassphrase(folderPassphraseBody);
            break;
        // Retrieve user public key
        case event.httpMethod === 'GET' && event.path === retrieveUserPublicKeyPath:
            const retrieveUserPublicKeyParams = event.queryStringParameters;
            response = await retrieveUserPublicKeyService.retrieveUserPublicKey(retrieveUserPublicKeyParams);
            break;
        // Store private key
        case event.httpMethod === 'POST' && event.path === storeprivatekeyPath:
            const storeprivatekeyBody = JSON.parse(event.body);
            response = await storeprivatekeyService.storeprivatekey(storeprivatekeyBody);
            break;
        // Retrieve user private key
        case event.httpMethod === 'POST' && event.path === retrieveUserPrivateKeyPath:
            const retrieveUserPrivateKeyParams = JSON.parse(event.body);
            response = await retrieveUserPrivateKeyService.retrieveUserPrivateKey(retrieveUserPrivateKeyParams);
            break;
        // Folder passphrase check
        case event.httpMethod === 'POST' && event.path === folderPassphraseCheckPath:
            const folderPassphraseCheckBody = JSON.parse(event.body);
            response = await folderPassphraseCheckService.folderPassphraseCheck(folderPassphraseCheckBody);
            break;

        // CORS
        // Health
        case event.httpMethod === 'OPTIONS'&& event.path === healthPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        case event.httpMethod === 'OPTIONS':
            response = util.buildCORSResponse(200, 'Success');
            break;
        // Register
        case event.httpMethod === 'OPTIONS' && event.path === loginPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        // Verify
        case event.httpMethod === 'OPTIONS' && event.path === verifyPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        // Register
        case event.httpMethod === 'OPTIONS' && event.path === registerPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        // Passphrase
        case event.httpMethod === 'OPTIONS'&& event.path === passphrasePath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        // Confirm passphrase
        case event.httpMethod === 'OPTIONS'&& event.path === confirmPassPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        // Folder passphrase
        case event.httpMethod === 'OPTIONS'&& event.path === folderPassphrasePath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        case event.httpMethod === 'OPTIONS'&& event.path === retrieveUserPublicKeyPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        case event.httpMethod === 'OPTIONS'&& event.path === storeprivatekeyPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        case event.httpMethod === 'OPTIONS'&& event.path === retrieveUserPrivateKeyPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        case event.httpMethod === 'OPTIONS'&& event.path === folderPassphraseCheckPath:
            response = util.buildCORSResponse(200, 'Success');
            break;
        // Default
        default:
            response = util.buildResponse(404, '404 Not Found');
    }
    return response;
};