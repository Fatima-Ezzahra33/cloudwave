import DashboardLayout from "@/components/DashboardLayout";
import GradientLayout from "@/components/GradientLayout";
import prisma from "@/lib/prisma";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function PlaylistPage({ params }: { params: { id: string } }) {
  const playlist = await prisma.playlist.findUnique({
    where: { id: params.id },
    include: {
      songs: {
        include: { artist: true },
      },
      user: true,
    },
  });

  if (!playlist) return <div>Playlist not found</div>;

  return (
    <DashboardLayout>
      <GradientLayout
        color="zinc"
        title={playlist.name}
        subtitle="Playlist"
        description={`${playlist.songs.length} songs`}
      >
        <div className="flex items-center gap-6 mb-8 mt-10">
           <Button className="w-14 h-14 bg-accent hover:bg-accent/90 rounded-full flex items-center justify-center shadow-xl">
              <Play className="w-6 h-6 fill-current text-white ml-1" />
           </Button>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-[16px_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-zinc-800 text-zinc-400 text-sm mb-4">
             <div>#</div>
             <div>Title</div>
             <div>Album</div>
             <div className="pr-4">Duration</div>
          </div>
          
          <div className="space-y-1">
             {playlist.songs.map((song, index) => (
               <div 
                  key={song.id}
                  className="grid grid-cols-[16px_1fr_1fr_auto] gap-4 px-4 py-2 hover:bg-white/10 rounded-md group transition-colors cursor-pointer items-center"
               >
                 <div className="text-zinc-500 text-sm">{index + 1}</div>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-zinc-800 rounded shrink-0"></div>
                   <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">{song.name}</div>
                      <div className="text-xs text-zinc-400 truncate">{song.artist.name}</div>
                   </div>
                 </div>
                 <div className="text-sm text-zinc-400 truncate">Album Name</div>
                 <div className="text-sm text-zinc-400 pr-4">
                    {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                 </div>
               </div>
             ))}
          </div>
        </div>
      </GradientLayout>
    </DashboardLayout>
  );
}
