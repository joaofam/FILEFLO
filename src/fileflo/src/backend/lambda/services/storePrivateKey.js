const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-west-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fileflo-users';
const util = require('../../../utils/util');

async function storeprivatekey(userInfo)  {
  const privateKey = userInfo.privateKey;
  if (!privateKey) {
    return util.buildResponse(401, {
      message: 'privateKey is required'
    })
  }

  const dynamoUser = await getUser(userInfo.username.toLowerCase().trim());
  if (!dynamoUser || !dynamoUser.username) {
    return util.buildResponse(403, { message: 'user does not exist'});
  }

  const user = {
    username: userInfo.username,
    privateKey: userInfo.privateKey
  }

  const saveUserResponse = await saveUser(user);
  if (!saveUserResponse) {
    return util.buildResponse(503, { message: 'Server Error. Please try again later.'});
  }

  return util.buildResponse(200, { message: 'Passphrase registered successfully' });
}

async function saveUser(user) {
  const params = {
    TableName: userTable,
    Item: user
  }
  return await dynamodb.put(params).promise().then(() => {
    return true;
  }, error => {
    console.error('There is an error saving user: ', error)
  });
}

async function getUser(username) {
  const params = {
    TableName: userTable,
    Key: {
      username: username
    }
  }

  return await dynamodb.get(params).promise().then(response => {
    return response.Item;
  }, error => {
    console.error('There is an error getting user: ', error);
  })
}

module.exports.storeprivatekey = storeprivatekey;