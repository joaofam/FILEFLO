const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-west-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fileflo-users';
const util = require('../../../utils/util');

async function retrieveUserPublicKey(user) {
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
      const publicKey = data.Item.publicKey;

      return util.buildResponse(200, { publicKey: publicKey });
    } else {
      return util.buildResponse(404, { message: "User not found" });
    }

  } catch (err) {
    console.log(err);
    return util.buildResponse(500, { message: "Internal Server Error", user: user });
  }
}

module.exports.retrieveUserPublicKey = retrieveUserPublicKey;
