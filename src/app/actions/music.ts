"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { createSafeActionClient } from "next-safe-action";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const actionClient = createSafeActionClient();

export const toggleLikeSong = actionClient
  .schema(z.object({ songId: z.string() }))
  .action(async ({ parsedInput: { songId } }) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { likedSongs: { where: { id: songId } } },
    });

    if (user?.likedSongs.length) {
      // Unlike
      await prisma.user.update({
        where: { id: userId },
        data: {
          likedSongs: {
            disconnect: { id: songId },
          },
        },
      });
    } else {
      // Like
      await prisma.user.update({
        where: { id: userId },
        data: {
          likedSongs: {
            connect: { id: songId },
          },
        },
      });
    }

    revalidatePath("/favorites");
    revalidatePath("/home");
    return { success: true };
  });

export const addSongToPlaylist = actionClient
  .schema(z.object({ songId: z.string(), playlistId: z.string() }))
  .action(async ({ parsedInput: { songId, playlistId } }) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership before updating
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { userId: true }
    });

    if (!playlist || playlist.userId !== session.user.id) {
      throw new Error("Unauthorized or playlist not found");
    }

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        songs: {
          connect: { id: songId },
        },
      },
    });

    revalidatePath(`/playlist/${playlistId}`);
    return { success: true };
  });

export const removeSongFromPlaylist = actionClient
  .schema(z.object({ songId: z.string(), playlistId: z.string() }))
  .action(async ({ parsedInput: { songId, playlistId } }) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    // Verify ownership before updating
    const playlist = await prisma.playlist.findUnique({
      where: { id: playlistId },
      select: { userId: true }
    });

    if (!playlist || playlist.userId !== session.user.id) {
      throw new Error("Unauthorized or playlist not found");
    }

    await prisma.playlist.update({
      where: { id: playlistId },
      data: {
        songs: {
          disconnect: { id: songId },
        },
      },
    });

    revalidatePath(`/playlist/${playlistId}`);
    return { success: true };
  });
