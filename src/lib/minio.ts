// lib/minio.ts

import * as Minio from "minio";

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const bucketName = process.env.MINIO_BUCKET || "music";

export async function getPresignedUrl(key: string) {
  if (!key) return "";
  if (key.startsWith("http")) return key;

  try {
    const url = await minioClient.presignedGetObject(bucketName, key, 3600);

    // Remplace le hostname interne Docker par localhost pour le browser

    const internalBase = `http://${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`;
    const publicBase = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";

    return url.replace(internalBase, publicBase);
  } catch (err) {
    console.error(`Error generating presigned URL for key: ${key}`, err);
    return "";
  }
}

export { minioClient, bucketName };
