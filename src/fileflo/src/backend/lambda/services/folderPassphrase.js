const AWS = require('aws-sdk');
AWS.config.update({
  region: 'eu-west-1'
});
const bcrypt = require('bcryptjs');
const dynamodb = new AWS.DynamoDB.DocumentClient();
const userTable = 'fileflo-users';
const util = require('../../../utils/util');

async function folderPassphrase(user) {
  const owner = user.owner;
  const username = user.username;
  const passphrase = user.passphrase;
  const folder = user.folder;

  if (!user || !passphrase) {
    console.log("Invalid input");
    return util.buildResponse(401, {
      message: 'Passphrase and username are required fields'
    });
  }

  const getUserParams = (user) => ({
    TableName: userTable,
    Key: {
      'username': user
    }
  });

  try {
    const userData = await dynamodb.get(getUserParams(username)).promise();

    if (userData && userData.Item) {
      const userPassphrases = userData.Item.passphrases || [];
      const folderAndPassphrase = userPassphrases.find((entry) => entry.startsWith(folder));

      if (!folderAndPassphrase && !owner) {
        const hash = await bcrypt.hash(passphrase, 10);
        const newFolderAndPassphrase = `${folder} : ${hash}`;
        userPassphrases.push(newFolderAndPassphrase);

        const updateParams = {
          TableName: userTable,
          Key: {
            'username': username
          },
          UpdateExpression: "set passphrases = :p",
          ExpressionAttributeValues: {
            ':p': userPassphrases
          }
        };

        await dynamodb.update(updateParams).promise();
      } else if (folderAndPassphrase && owner) {
        const ownerData = await dynamodb.get(getUserParams(owner)).promise();

        if (ownerData && ownerData.Item) {
          const ownerPassphrases = ownerData.Item.passphrases || [];
          ownerPassphrases.push(folderAndPassphrase);

          const updateParams = {
            TableName: userTable,
            Key: {
              'username': owner
            },
            UpdateExpression: "set passphrases = :p",
            ExpressionAttributeValues: {
              ':p': ownerPassphrases
            }
          };

          await dynamodb.update(updateParams).promise();
        } else {
          return util.buildResponse(404, { message: "Owner not found" });
        }
      }

      return util.buildResponse(200, { message: "Success" });
    } else {
      return util.buildResponse(404, { message: "User not found" });
    }
  } catch (err) {
    return util.buildResponse(500, { message: "Internal Server Error" });
  }
}

module.exports.folderPassphrase = folderPassphrase;
