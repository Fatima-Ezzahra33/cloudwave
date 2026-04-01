import { PrismaClient } from "@prisma/client";
import * as dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("Checking DB...");
  try {
    const count = await prisma.song.count();
    console.log(`Songs count: ${count}`);
    const firstSong = await prisma.song.findFirst();
    console.log("First song:", firstSong);
  } catch (err) {
    console.error("DB error:", (err as Error).message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
