import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getPresignedUrl } from "@/lib/minio";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  let songs;
  if (!query) {
    songs = await prisma.song.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { artist: true },
    });
  } else {
    songs = await prisma.song.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { artist: { name: { contains: query, mode: "insensitive" } } },
        ],
      },
      include: {
        artist: true,
      },
    });
  }

  const songsWithUrls = await Promise.all(
    songs.map(async (song) => ({
      ...song,
      url: await getPresignedUrl(song.url),
    }))
  );

  return NextResponse.json(songsWithUrls);

}
