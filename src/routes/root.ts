import { FastifyInstance } from "fastify";
import fastifyMultipart from "fastify-multipart";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { setOriginValue } from "../utils";

import { getAwsConfig } from "../utils";

const s3 = new S3Client(getAwsConfig());

const uploadRoute = async (app: FastifyInstance) => {
  app.options("/*", async (request, reply) => {
    reply
      .headers({
        "Access-Control-Allow-Origin": setOriginValue(request),
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      })
      .send();
  });

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  app.post("/images", async (request, reply) => {
    const bucketName = process.env.BUCKET_NAME;

    if (!bucketName) {
      reply.status(400).send({ error: "Missing file or bucket configuration" });
      return;
    }

    try {
      const file = await request.file();

      if (!file) {
        reply.status(400).send({ error: "No file uploaded" });
        return;
      }

      const fileContent = await file.toBuffer();

      const uploadParams = {
        Bucket: bucketName,
        Key: file.filename,
        Body: fileContent,
        ContentType: file.mimetype,
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3.send(command);

      reply
        .status(200)
        .headers({
          "Access-Control-Allow-Origin": setOriginValue(request),
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        })
        .send({ message: "File uploaded successfully", data });
    } catch (err) {
      reply.status(500).send({ error: "File upload failed", details: err });
    }
  });
};

export default uploadRoute;
