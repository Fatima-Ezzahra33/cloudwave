import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  // Clean database
  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  // Create User
  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      passwordHash,
      firstName: "Cloud",
      lastName: "User",
    },
  });

  // Create Artists
  const artists = await Promise.all([
    prisma.artist.create({ data: { name: "The Weeknd" } }),
    prisma.artist.create({ data: { name: "Drake" } }),
    prisma.artist.create({ data: { name: "Post Malone" } }),
    prisma.artist.create({ data: { name: "Taylor Swift" } }),
  ]);

  // Create Songs
  const songs = await Promise.all([
    prisma.song.create({
      data: {
        name: "Blinding Lights",
        duration: 200,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        artistId: artists[0].id,
      },
    }),
    prisma.song.create({
      data: {
        name: "One Dance",
        duration: 210,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        artistId: artists[1].id,
      },
    }),
    prisma.song.create({
      data: {
        name: "Circles",
        duration: 180,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        artistId: artists[2].id,
      },
    }),
    prisma.song.create({
      data: {
        name: "Anti-Hero",
        duration: 190,
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        artistId: artists[3].id,
      },
    }),
  ]);

  // Create Playlist
  await prisma.playlist.create({
    data: {
      name: "My Favorites",
      userId: user.id,
      songs: {
        connect: songs.map((s) => ({ id: s.id })),
      },
    },
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
