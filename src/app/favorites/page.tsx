import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import SongList from "@/components/SongList";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      likedSongs: {
        include: { artist: true },
      },
    },
  });

  return (
    <DashboardLayout>
      <GradientLayout
        color="#5038a0"
        title="Liked Songs"
        subtitle="Playlist"
        description={`${user?.likedSongs.length || 0} songs`}
      >
        <SongList songs={user?.likedSongs || []} />
      </GradientLayout>
    </DashboardLayout>
  );
}
