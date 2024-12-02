import { fromIni } from "@aws-sdk/credential-provider-ini";
import { S3ClientConfig } from "@aws-sdk/client-s3";

interface AwsConfig extends S3ClientConfig {}

export const getAwsConfig = (): AwsConfig => {
  if (process.env.ENVIRONMENT === "local") {
    return {
      region: process.env.AWS_REGION,
      credentials: fromIni({ profile: process.env.PROFILE }),
    };
  }

  return {
    region: process.env.AWS_REGION,
  };
};
