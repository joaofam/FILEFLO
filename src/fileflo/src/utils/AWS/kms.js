//External imports
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'AKIA6EEHU3CY7356YO6F',
  secretAccessKey: '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',
  region: 'eu-west-1',
});

const kms = new AWS.KMS();

export default kms;
