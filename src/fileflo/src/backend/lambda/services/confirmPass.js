const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-west-1'
});
const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fileflo-users';
const util = require('../../../utils/util');

async function confirmPass(user) {
  const username = user.username;
  const passphrase = user.passphrase;
  if (!user || !passphrase) {
    return util.buildResponse(401, {
      message: 'Passphrase and username are required fields'
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
      const hash = data.Item.passphrase;

      const match = await bcrypt.compare(passphrase, hash[0]);

      if (match) {
        return util.buildResponse(200, { message: "Success" });
      } else {
        return util.buildResponse(403, { message: "Incorrect passphrase" });
      }
    } else {
      return util.buildResponse(404, { message: "User not found" });
    }

  } catch (err) {
    console.log(err);
    return util.buildResponse(500, { message: "Internal Server Error" });
  }
}

module.exports.confirmPass = confirmPass;