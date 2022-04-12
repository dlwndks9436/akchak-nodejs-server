import AWS from "aws-sdk";

interface Input {
  bucket: string;
  key: string;
  expires?: number;
}

AWS.config = new AWS.Config({
  region: process.env.AWS_DEFAULT_REGION,
});

const s3 = new AWS.S3();

export default ({ bucket, key, expires }: Input) => {
  const signedUrl = s3.getSignedUrl("getObject", {
    Key: key,
    Bucket: bucket,
    Expires: expires || 900, // S3 default is 900 seconds (15 minutes)
  });

  return signedUrl;
};
