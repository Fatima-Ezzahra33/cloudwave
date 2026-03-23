import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import SongList from "@/components/SongList";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

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
          songs={userData?.likedSongs || []} 
          likedSongIds={likedSongIds}
          playlists={playlists}
        />
      </GradientLayout>
    </DashboardLayout>
  );
}
