import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import LibraryClient from "@/components/SuperLibraryClient";
import { getPresignedUrl } from "@/lib/minio";
import { redirect } from "next/navigation";


export default async function LibraryPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      playlists: {
        include: { 
          songs: { include: { artist: true } },
          _count: { select: { songs: true } } 
        },
      },
    },
  });

  if (!user) redirect("/signin");

  const playlistsWithSignedUrls = await Promise.all(
    user.playlists.map(async (playlist) => ({
      ...playlist,
      songs: await Promise.all(
        playlist.songs.map(async (song) => ({
          ...song,
          url: await getPresignedUrl(song.url),
        }))
      ),
    }))
  );

  return (
    <DashboardLayout>
      <GradientLayout
        color="#e8351e"
        title="Your Library"
        subtitle="Collection"
      >
        <LibraryClient playlists={playlistsWithSignedUrls as any} />
      </GradientLayout>
    </DashboardLayout>
  );

}
