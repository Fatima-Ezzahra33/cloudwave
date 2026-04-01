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

    if (!user) throw new Error("User not found in database. Please sign out and sign back in.");

    if (user.likedSongs.length) {
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

    revalidatePath("/", "layout");
    revalidatePath("/search");
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

    revalidatePath("/", "layout");
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
export const getUserMetadata = actionClient
  .action(async () => {
    const session = await auth();
    if (!session?.user?.id) return { likedSongIds: [], playlists: [] };

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        likedSongs: { select: { id: true } },
        playlists: { select: { id: true, name: true } }
      }
    });

    return {
      likedSongIds: user?.likedSongs.map(s => s.id) || [],
      playlists: user?.playlists || []
    };
  });
export const createPlaylist = actionClient
  .schema(z.object({ name: z.string() }))
  .action(async ({ parsedInput: { name } }) => {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    const playlist = await prisma.playlist.create({
      data: {
        name,
        userId: session.user.id,
      },
    });

    revalidatePath("/library");
    return playlist;
  });
