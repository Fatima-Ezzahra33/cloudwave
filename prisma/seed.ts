import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const artistsData = [
  {
    name: "Glitch",
    songs: [
      {
        name: "Fermi Paradox",
        duration: 235,
        url: "https://dl.dropboxusercontent.com/s/7xmpwvvek6szx5n/fermi-paradox.mp3?raw=1",
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
      },
      {
        name: "Astronaut in a Submarine",
        duration: 239,
        url: "https://dl.dropboxusercontent.com/s/9b43fr6epbgji4f/astronaut-in-a-submarine.mp3?raw=1",
      },
    ],
  },
];

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

  // Create Artists and Songs
  for (const artistItem of artistsData) {
    const artist = await prisma.artist.create({
      data: {
        name: artistItem.name,
      },
    });

    for (const songItem of artistItem.songs) {
      await prisma.song.create({
        data: {
          name: songItem.name,
          duration: songItem.duration,
          url: songItem.url,
          artistId: artist.id,
        },
      });
    }
  }

  // Get all songs to populate a default playlist
  const allSongs = await prisma.song.findMany();

  // Create Default Playlist for user
  await prisma.playlist.create({
    data: {
      name: "Cloudwave Favorites",
      userId: user.id,
      songs: {
        connect: allSongs.map((s) => ({ id: s.id })),
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
