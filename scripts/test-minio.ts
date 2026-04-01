import * as Minio from "minio";
import * as dotenv from "dotenv";
dotenv.config();

const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

async function main() {
  console.log("Checking MinIO...");
  try {
    const buckets = await minioClient.listBuckets();
    console.log("Buckets:", buckets.map(b => b.name));
    const exists = await minioClient.bucketExists("music");
    console.log("Music bucket exists:", exists);
  } catch (err) {
    console.error("MinIO error:", err);
  }
}
main();
