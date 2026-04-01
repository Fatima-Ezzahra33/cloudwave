import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import SongList from "@/components/SongList";
import { getPresignedUrl } from "@/lib/minio";


import { redirect } from "next/navigation";


export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/signin");

  const userData = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      likedSongs: {
        include: { artist: true },
        orderBy: { createdAt: 'desc' }
      },
      playlists: { select: { id: true, name: true } }
    },
  });

  const likedSongIds = userData?.likedSongs.map(s => s.id) || [];
  
  const songs = await Promise.all(
    (userData?.likedSongs || []).map(async (song) => ({
      ...song,
      url: await getPresignedUrl(song.url),
    }))
  );

  const playlists = userData?.playlists || [];


  return (
    <DashboardLayout>
      <GradientLayout
        color="#e8351e"
        title="Liked Songs"
        subtitle="Playlist"
        description={`${userData?.likedSongs.length || 0} songs`}
      >
        <SongList 
          songs={songs} 
          likedSongIds={likedSongIds}
          playlists={playlists}
        />

      </GradientLayout>
    </DashboardLayout>
  );
}
