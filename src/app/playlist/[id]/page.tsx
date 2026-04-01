import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import SongList from "@/components/SongList";
import { auth } from "@/auth";
import { getPresignedUrl } from "@/lib/minio";


export default async function PlaylistPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();
  const userId = session?.user?.id;

  const [playlist, user] = await Promise.all([
    prisma.playlist.findUnique({
      where: { id: params.id },
      include: {
        songs: {
          include: { artist: true },
        },
      },
    }),
    userId ? prisma.user.findUnique({
      where: { id: userId },
      include: { 
        likedSongs: { select: { id: true } },
        playlists: { select: { id: true, name: true } }
      }
    }) : Promise.resolve(null)
  ]);

  if (!playlist) return <div>Playlist not found</div>;

  const songs = await Promise.all(
    playlist.songs.map(async (song) => ({
      ...song,
      url: await getPresignedUrl(song.url),
    }))
  );

  const likedSongIds = user?.likedSongs.map(s => s.id) || [];

  const playlists = user?.playlists || [];

  return (
    <DashboardLayout>
      <GradientLayout
        color="#e8351e"
        title={playlist.name}
        subtitle="Playlist"
        description={`${playlist.songs.length} songs`}
      >
        <div className="flex items-center gap-6 mb-12 mt-10">
           <Button className="w-16 h-16 bg-[#e8351e] hover:bg-[#c8291a] hover:scale-105 rounded-full flex items-center justify-center shadow-2xl shadow-[#e8351e]/20 transition-all border-none group">
              <Play className="w-7 h-7 fill-current text-white ml-1 group-hover:scale-110 transition-transform" />
           </Button>
        </div>

        <SongList 
          songs={songs} 
          likedSongIds={likedSongIds}
          playlists={playlists}
        />

      </GradientLayout>
    </DashboardLayout>
  );
}
