import AWS from 'aws-sdk';
import { Constants } from './constants';

// config AWS S3
const s3 = new AWS.S3({
  accessKeyId: Constants.AWS_ACCESS_KEY_ID,
  secretAccessKey: Constants.AWS_SECRET_ACCESS_KEY_ID,
  region: 'sa-east-1'
});

export async function generateProfileImageUploadURL(userId: string, fileType: string) {
  const s3Params = {
    Bucket: 'testingnode',
    Key: `profile-images/${userId}.${fileType}`,
    ContentType: `image/${fileType}`,
    ACL: 'public-read',
    Expires: 6800
  };

  try {
    const data = await s3.getSignedUrlPromise('putObject', s3Params);
    return data;
  } catch (err: any) {
    throw new Error(`Error to generate an pre-signed url: ${err.message}`);
  }
}
