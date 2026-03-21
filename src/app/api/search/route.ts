import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json([]);
  }

  const songs = await prisma.song.findMany({
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

  return NextResponse.json(songs);
}
