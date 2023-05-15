const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-west-1'
});
const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fileflo-users';
const util = require('../../../utils/util');

async function folderPassphraseCheck(user) {
  const username = user.username;
  const passphrase = user.passphrase;
  const folder = user.folder;

  if (!user || !passphrase || !folder) {
    return util.buildResponse(401, {
      message: 'Error: Something went wrong, ensure your passphrase is correct'
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
    const passphrases = data.Item.passphrases;
    let match = false;
    let matchedPassphrase = null;

    // Iterate through the passphrases array
    for (const storedPassphrase of passphrases) {
      const [storedFolder, storedHash] = storedPassphrase.split(' : ');

      // Compare input passphrase with stored hash for the specified folder
      if (folder === storedFolder) {
        match = await bcrypt.compare(passphrase, storedHash);
        if (match) {
          matchedPassphrase = storedPassphrase;
          break;
        }
      }
    }

    if (match) {
      return util.buildResponse(200, { message: "Success", passphrase: matchedPassphrase });
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

module.exports.folderPassphraseCheck = folderPassphraseCheck;
