import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma } from "@prisma/client";

// Define the precise type for an artist with its nested songs
type ArtistWithSongs = Prisma.ArtistGetPayload<{
  include: { songs: true };
}>;

export default async function HomePage() {
  const session = await auth();
  const artists = await prisma.artist.findMany({
    include: { songs: true },
  }) as ArtistWithSongs[];

  return (
    <DashboardLayout>
      <GradientLayout
        color="red"
        title="Welcome Back"
        subtitle="Your personalized home"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {artists.map((artist) => (
            <div 
               key={artist.id}
               className="bg-zinc-900/40 p-4 rounded-lg hover:bg-zinc-800/80 transition-all cursor-pointer group shadow-lg"
            >
              <div className="aspect-square bg-zinc-800 rounded-full mb-4 overflow-hidden relative shadow-xl">
                 <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent group-hover:from-accent/40 transition-all"></div>
              </div>
              <h3 className="font-bold text-white truncate">{artist.name}</h3>
              <p className="text-zinc-400 text-sm">Artist</p>
            </div>
          ))}
        </div>

        <section className="mt-12">
           <h2 className="text-2xl font-bold mb-6">Recently Added</h2>
           <div className="space-y-2">
              {artists[0]?.songs.map((song) => (
                <div 
                   key={song.id}
                   className="flex items-center gap-4 p-2 hover:bg-white/10 rounded-md group transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-zinc-800 rounded flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 bg-accent/40 rounded-sm"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-white truncate">{song.name}</div>
                    <div className="text-xs text-zinc-400 truncate">{artists[0].name}</div>
                  </div>
                  <div className="text-xs text-zinc-500">{Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}</div>
                </div>
              ))}
           </div>
        </section>
      </GradientLayout>
    </DashboardLayout>
  );
}
