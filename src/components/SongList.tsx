"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLikeSong } from "@/app/actions/music";
import { useState } from "react";

interface Song {
  id: string;
  name: string;
  artist: { name: string };
  url: string;
  duration: number;
}

interface SongListProps {
  songs: Song[];
}

export default function SongList({ songs }: SongListProps) {
  const { setCurrentTrack, setQueue, currentTrack, isPlaying, setIsPlaying } = usePlayerStore();
  const [likedSongs, setLikedSongs] = useState<string[]>([]); // This would ideally come from props or a query

  const handlePlay = (song: Song) => {
    if (currentTrack?.id === song.id) {
      setIsPlaying(!isPlaying);
    } else {
      setQueue(songs);
      setCurrentTrack(song);
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-[16px_1fr_1fr_auto] gap-4 px-4 py-2 border-b border-zinc-800 text-zinc-400 text-sm mb-4">
        <div>#</div>
        <div>Title</div>
        <div>Artist</div>
        <div className="pr-4 text-right">Duration</div>
      </div>
      
      <div className="space-y-1">
        {songs.map((song, index) => (
          <div 
            key={song.id}
            onClick={() => handlePlay(song)}
            className={cn(
               "grid grid-cols-[16px_1fr_1fr_auto] gap-4 px-4 py-2 hover:bg-white/10 rounded-md group transition-colors cursor-pointer items-center",
               currentTrack?.id === song.id && "text-accent"
            )}
          >
            <div className="text-zinc-500 text-sm group-hover:hidden">{index + 1}</div>
            <div className="hidden group-hover:block">
               <Play className={cn("w-4 h-4 fill-current", currentTrack?.id === song.id ? "text-accent" : "text-white")} />
            </div>
            
            <div className="flex items-center gap-3 min-w-0">
               <div className="w-10 h-10 bg-zinc-800 rounded shrink-0"></div>
               <div className="truncate font-medium">{song.name}</div>
            </div>
            
            <div className="text-sm text-zinc-400 truncate">{song.artist.name}</div>
            
            <div className="flex items-center gap-4 pr-4 justify-end">
               <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      await toggleLikeSong({ songId: song.id });
                    } catch (error) {
                      console.error("Failed to like song:", error);
                    }
                  }}
                  className="opacity-0 group-hover:opacity-100 hover:scale-110 transition-all"
               >
                  <Heart className="w-4 h-4 text-zinc-400 hover:text-accent" />
               </button>
               <div className="text-sm text-zinc-400 w-10 text-right">
                  {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
