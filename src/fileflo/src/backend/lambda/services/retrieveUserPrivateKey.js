const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-west-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const kms = new AWS.KMS(); // Initialize the KMS clien
const userTable = 'fileflo-users';
const util = require('../../../utils/util');

async function retrieveUserPrivateKey(user) {
  const username = user.username;
  if (!username) {
    return util.buildResponse(400, {
      message: 'Username is a required field'
    });
  }

  const params = {
    TableName: userTable,
    Key: {
      'username': username
    }
  };

  try {
    const data = await dynamodb.get(params).promise();

    if (data && data.Item) {
      const encryptedPrivateKey = data.Item.privateKey;

      // Decrypt the private key using KMS
      const decryptParams = {
        CiphertextBlob: Buffer.from(encryptedPrivateKey, 'base64')
      };
      const decryptedData = await kms.decrypt(decryptParams).promise();
      const privateKey = decryptedData.Plaintext.toString('utf-8');

      return util.buildResponse(200, { privateKey: privateKey });
    } else {
      return util.buildResponse(404, { message: "User not found" });
    }

  } catch (err) {
    console.log(err);
    return util.buildResponse(500, { message: "Internal Server Error", user: user });
  }
}


module.exports.retrieveUserPrivateKey = retrieveUserPrivateKey;
