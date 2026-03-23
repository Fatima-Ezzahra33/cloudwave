"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Play, Heart, Plus, ListMusic } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleLikeSong, addSongToPlaylist } from "@/app/actions/music";
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
  likedSongIds?: string[];
  playlists?: { id: string, name: string }[];
}

export default function SongList({ songs, likedSongIds = [], playlists = [] }: SongListProps) {
  const { setCurrentTrack, setQueue, currentTrack, isPlaying, setIsPlaying } = usePlayerStore();
  const [showPlaylistMenu, setShowPlaylistMenu] = useState<string | null>(null);

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
      <div className="grid grid-cols-[16px_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/5 text-white/30 text-[10px] font-bold uppercase tracking-widest mb-4">
        <div>#</div>
        <div>Title</div>
        <div>Artist</div>
        <div className="pr-6 text-right">Duration</div>
      </div>
      
      <div className="space-y-1">
        {songs.map((song, index) => {
          const isLiked = likedSongIds.includes(song.id);
          return (
            <div 
              key={song.id}
              onClick={() => handlePlay(song)}
              className={cn(
                 "grid grid-cols-[16px_1fr_1fr_auto] gap-4 px-6 py-3 hover:bg-white/5 rounded-xl group transition-all cursor-pointer items-center border border-transparent hover:border-white/5 shadow-sm hover:shadow-xl relative",
                 currentTrack?.id === song.id && "bg-white/5 border-white/10"
              )}
            >
              <div className="text-zinc-500 text-sm group-hover:hidden">{index + 1}</div>
              <div className="hidden group-hover:block">
                 <Play className={cn("w-4 h-4 fill-current", currentTrack?.id === song.id ? "text-[#e8351e]" : "text-white")} />
              </div>
              
               <div className="flex items-center gap-4 min-w-0">
                  <div className="w-10 h-10 bg-white/5 border border-white/5 rounded-lg shrink-0 overflow-hidden relative group-hover:border-white/10 transition-colors">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#e8351e]/10 to-transparent"></div>
                  </div>
                  <div className={cn("truncate font-bold text-sm tracking-tight", currentTrack?.id === song.id ? "text-[#e8351e]" : "text-white/90")}>{song.name}</div>
              </div>
              
              <div className="text-xs font-bold text-white/30 uppercase tracking-widest truncate">{song.artist.name}</div>
              
               <div className="flex items-center gap-4 pr-6 justify-end relative">
                  <button 
                     onClick={async (e) => {
                       e.stopPropagation();
                       try {
                         await toggleLikeSong({ songId: song.id });
                       } catch (error) {
                         console.error("Failed to like song:", error);
                       }
                     }}
                     className={cn(
                       "opacity-0 group-hover:opacity-100 hover:scale-125 transition-all outline-none",
                       isLiked && "opacity-100"
                     )}
                  >
                     <Heart className={cn("w-3.5 h-3.5 transition-colors", isLiked ? "text-[#e8351e] fill-[#e8351e]" : "text-white/20 hover:text-[#e8351e]")} />
                  </button>
                  
                  <div className="relative">
                    <button 
                       onClick={(e) => {
                         e.stopPropagation();
                         setShowPlaylistMenu(showPlaylistMenu === song.id ? null : song.id);
                       }}
                       className="opacity-0 group-hover:opacity-100 hover:scale-125 transition-all outline-none"
                    >
                       <Plus className="w-4 h-4 text-white/20 hover:text-white" />
                    </button>

                    {showPlaylistMenu === song.id && (
                      <div 
                        className="absolute right-0 bottom-full mb-2 w-48 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl z-50 p-2 noise overflow-hidden animate-in fade-in slide-in-from-bottom-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                         <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest px-3 py-2 border-b border-white/5 mb-1">Add to Playlist</div>
                         {playlists.length > 0 ? playlists.map(p => (
                           <button
                             key={p.id}
                             onClick={async () => {
                               try {
                                 await addSongToPlaylist({ songId: song.id, playlistId: p.id });
                                 setShowPlaylistMenu(null);
                               } catch (err) {
                                 console.error("Failed to add to playlist", err);
                               }
                             }}
                             className="w-full text-left px-3 py-2 text-[11px] font-bold text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all flex items-center gap-2 group/item"
                           >
                             <ListMusic className="w-3.5 h-3.5 group-hover/item:text-[#e8351e] transition-colors" />
                             {p.name}
                           </button>
                         )) : (
                           <div className="px-3 py-2 text-[10px] text-white/20 font-bold italic">No playlists found</div>
                         )}
                      </div>
                    )}
                  </div>

                  <div className="text-[11px] font-bold text-white/20 w-10 text-right tabular-nums">
                     {Math.floor(song.duration / 60)}:{(song.duration % 60).toString().padStart(2, '0')}
                  </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
