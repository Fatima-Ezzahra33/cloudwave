import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";
import SongList from "@/components/SongList";
import { getPresignedUrl } from "@/lib/minio";

type ArtistWithSongs = Prisma.ArtistGetPayload<{
  include: { songs: { include: { artist: true } } };
}>;

export default async function HomePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [artists, user] = await Promise.all([
    prisma.artist.findMany({
      include: { songs: { include: { artist: true } } },
    }) as Promise<ArtistWithSongs[]>,
    userId
      ? prisma.user.findUnique({
          where: { id: userId },
          include: {
            likedSongs: { select: { id: true } },
            playlists: { select: { id: true, name: true } },
          },
        })
      : Promise.resolve(null),
  ]);

  const allRecentSongsRaw = artists.flatMap((a) => a.songs).slice(0, 10);
  const allRecentSongs = await Promise.all(
    allRecentSongsRaw.map(async (song) => ({
      ...song,
      url: await getPresignedUrl(song.url),
      coverUrl: song.coverUrl ?? undefined,
    }))
  );

  const likedSongIds = user?.likedSongs.map((s) => s.id) || [];
  const playlists = user?.playlists || [];

  // Get one cover per artist from their first song
  const artistsWithCover = artists.map((artist) => ({
    ...artist,
    coverUrl: artist.songs[0]?.coverUrl ?? null,
  }));

  return (
    <DashboardLayout>
      <GradientLayout color="#e8351e" title="Welcome Back" subtitle="Your personalized home">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {artistsWithCover.map((artist) => (
            <div
              key={artist.id}
              className="bg-white/5 border border-white/5 p-5 rounded-3xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group shadow-lg noise"
            >
              <div className="aspect-square bg-white/5 border border-white/5 rounded-full mb-5 overflow-hidden relative shadow-2xl">
                {artist.coverUrl ? (
                  <img src={artist.coverUrl} alt={artist.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#e8351e]/20 to-transparent group-hover:from-[#e8351e]/40 transition-all" />
                )}
              </div>
              <h3 className="font-bold text-white text-sm tracking-tight truncate group-hover:text-[#e8351e] transition-colors">
                {artist.name}
              </h3>
              <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mt-1">Artist</p>
            </div>
          ))}
        </div>

        <section className="mt-20">
          <h2 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8 ml-2">Recently Added</h2>
          <SongList songs={allRecentSongs} likedSongIds={likedSongIds} playlists={playlists} />
        </section>
      </GradientLayout>
    </DashboardLayout>
  );
}