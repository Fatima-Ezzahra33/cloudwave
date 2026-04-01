import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const MINIO_URL = process.env.MINIO_PUBLIC_URL || "http://localhost:9000";

const artistsData = [
  {
    name: "d4vd",
    songs: [
      {
        name: "Romantic Homicide",
        duration: 175,
        url: `${MINIO_URL}/music/d4vd%20-%20Romantic%20Homicide.mp3`,
        coverUrl: `${MINIO_URL}/music/d4vd.jpg`,
      },
    ],
  },
  {
    name: "Indila",
    songs: [
      {
        name: "Love Story",
        duration: 210,
        url: `${MINIO_URL}/music/Indila%20-%20Love%20Story%20(Official%20Music%20Video).mp3`,
        coverUrl: `${MINIO_URL}/music/indila.jpg`,
      },
    ],
  },
  {
    name: "Billie Eilish",
    songs: [
      {
        name: "WILDFLOWER",
        duration: 195,
        url: `${MINIO_URL}/music/Billie%20Eilish%20-%20WILDFLOWER%20(Official%20Lyric%20Video).mp3`,
        coverUrl: `${MINIO_URL}/music/billie-eilish.jpg`,
      },
    ],
  },
  {
    name: "Glitch",
    songs: [
      {
        name: "Fermi Paradox",
        duration: 235,
        url: "https://dl.dropboxusercontent.com/s/7xmpwvvek6szx5n/fermi-paradox.mp3?raw=1",
        coverUrl: `${MINIO_URL}/music/glitch.jpg`,
      },
    ],
  },
  {
    name: "Purple Cat",
    songs: [
      {
        name: "Long Day",
        duration: 185,
        url: "https://dl.dropboxusercontent.com/s/9h90r7ku3df5o9y/long-day.mp3?raw=1",
        coverUrl: `${MINIO_URL}/music/purple-cat.jpg`,
      },
    ],
  },
  {
    name: "Ben Sound",
    songs: [
      {
        name: "The Elevator Bossa Nova",
        duration: 238,
        url: "https://dl.dropboxusercontent.com/s/7dh5o3kfjcz0nh3/The-Elevator-Bossa-Nova.mp3?raw=1",
        coverUrl: `${MINIO_URL}/music/ben-sound.jpg`,
      },
    ],
  },
  {
    name: "LiQWYD",
    songs: [
      {
        name: "Winter",
        duration: 162,
        url: "https://dl.dropboxusercontent.com/s/tlx2zev0as500ki/winter.mp3?raw=1",
        coverUrl: `${MINIO_URL}/music/liqwyd.jpg`,
      },
    ],
  },
  {
    name: "FSM Team",
    songs: [
      {
        name: "Eternal Springtime",
        duration: 302,
        url: "https://dl.dropboxusercontent.com/s/92u8d427bz0b1t8/eternal-springtime.mp3?raw=1",
        coverUrl: `${MINIO_URL}/music/fsm-team.jpg`,
      },
      {
        name: "Astronaut in a Submarine",
        duration: 239,
        url: "https://dl.dropboxusercontent.com/s/9b43fr6epbgji4f/astronaut-in-a-submarine.mp3?raw=1",
        coverUrl: `${MINIO_URL}/music/fsm-team.jpg`,
      },
    ],
  },
];

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  await prisma.playlist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "user@example.com",
      passwordHash,
      firstName: "Cloud",
      lastName: "User",
    },
  });

  for (const artistItem of artistsData) {
    const artist = await prisma.artist.create({
      data: { name: artistItem.name },
    });

    for (const songItem of artistItem.songs) {
      await prisma.song.create({
        data: {
          name: songItem.name,
          duration: songItem.duration,
          url: songItem.url,
          coverUrl: songItem.coverUrl,
          artistId: artist.id,
        },
      });
    }
  }

  const allSongs = await prisma.song.findMany();

  await prisma.playlist.create({
    data: {
      name: "Cloudwave Favorites",
      userId: user.id,
      songs: {
        connect: allSongs.map((s: { id: string }) => ({ id: s.id })),
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