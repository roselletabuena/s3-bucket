import { fromIni } from "@aws-sdk/credential-provider-ini";
import { S3ClientConfig } from "@aws-sdk/client-s3";
import { FastifyRequest } from "fastify";

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

export const setOriginValue = (request: FastifyRequest): string | undefined => {
  const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
  const ORIGIN = request.headers.origin || "";

  if (ALLOWED_ORIGINS.includes(ORIGIN)) return ORIGIN;
};
