import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import * as Minio from "minio";
import axios from "axios";
import * as dotenv from "dotenv";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set in .env");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


const minioClient = new Minio.Client({
  endPoint: process.env.MINIO_ENDPOINT || "localhost",
  port: parseInt(process.env.MINIO_PORT || "9000"),
  useSSL: false,
  accessKey: process.env.MINIO_ACCESS_KEY || "minioadmin",
  secretKey: process.env.MINIO_SECRET_KEY || "minioadmin",
});

const bucketName = process.env.MINIO_BUCKET || "music";

async function migrate() {
  console.log("Starting migration to MinIO...");

  // Ensure bucket exists
  try {
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(`Creating bucket: ${bucketName}`);
      await minioClient.makeBucket(bucketName);
    } else {
      console.log(`Bucket ${bucketName} already exists.`);
    }
  } catch (err) {
    console.error("Error checking/creating bucket:", (err as Error).message);
    process.exit(1);
  }

  const songs = await prisma.song.findMany();
  console.log(`Found ${songs.length} songs in database.`);

  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  for (const song of songs) {
    if (song.url.startsWith("http")) {
      console.log(`Migrating song: ${song.name} (${song.id})`);
      const objectKey = `${song.id}.mp3`;

      try {
        // Download from current URL
        console.log(`  Downloading from ${song.url}...`);
        const response = await axios.get(song.url, { responseType: "arraybuffer" });
        const buffer = Buffer.from(response.data);

        // Upload to MinIO
        console.log(`  Uploading to MinIO as ${objectKey}...`);
        await minioClient.putObject(bucketName, objectKey, buffer);

        // Update DB
        await prisma.song.update({
          where: { id: song.id },
          data: { url: objectKey },
        });
        
        console.log(`  Successfully migrated: ${song.name}`);
        migratedCount++;
      } catch (err) {
        console.error(`  Failed to migrate ${song.name}:`, (err as Error).message);
        errorCount++;
      }
    } else {
      console.log(`Skipping song (not a remote URL): ${song.name} (${song.id})`);
      skippedCount++;
    }
  }

  console.log("\nMigration Summary:");
  console.log(`Total: ${songs.length}`);
  console.log(`Migrated: ${migratedCount}`);
  console.log(`Skipped: ${skippedCount}`);
  console.log(`Errors: ${errorCount}`);
}

migrate()
  .catch((err) => {
    console.error("Migration fatal error:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database disconnected.");
  });
