"use client";

import { useState } from "react";
import { Plus, Play, ListMusic, X } from "lucide-react";
import { usePlayerStore } from "@/store/usePlayerStore";
import { createPlaylist } from "@/app/actions/music";
import Link from "next/link";
import { Button } from "./ui/button";

interface Song {
  id: string;
  name: string;
  url: string;
  duration: number;
  artist: { name: string };
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
  _count: { songs: number };
}

interface LibraryClientProps {
  playlists: Playlist[];
}

export default function LibraryClient({ playlists }: LibraryClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const { setQueue, setCurrentTrack, setIsPlaying } = usePlayerStore();

  const handlePlayAll = () => {
    try {
      const allSongs = playlists?.flatMap((p) => p.songs || []) || [];
      // ALERT FOR DEBUGGING
      if (allSongs.length === 0) {
        alert("No songs found in your library playlists. Please add some songs first!");
        return;
      }
      
      setQueue(allSongs);
      setCurrentTrack(allSongs[0]);
      setIsPlaying(true);
    } catch (err) {
      alert("Error in Play All: " + (err as Error).message);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;
    try {
      await createPlaylist({ name: playlistName });
      setIsModalOpen(false);
      setPlaylistName("");
    } catch (err) {
      console.error("Failed to create playlist", err);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-6 mb-12 mt-4">
        <button 
          onClick={handlePlayAll}
          className="w-16 h-16 bg-[#e8351e] hover:bg-[#c8291a] hover:scale-105 rounded-full flex items-center justify-center shadow-2xl shadow-[#e8351e]/20 transition-all border-none group cursor-pointer"
        >
          <Play className="w-7 h-7 fill-current text-white ml-1 group-hover:scale-110 transition-transform" />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Play All collection</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {/* Create Card */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-white/5 border border-white/5 border-dashed p-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group shadow-lg flex flex-col items-center text-center noise"
        >
          <div className="w-full aspect-square bg-white/5 border border-white/5 rounded-xl mb-5 flex items-center justify-center shadow-2xl relative overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-br from-[#e8351e]/5 to-transparent"></div>
             <Plus className="w-12 h-12 text-white/10 group-hover:text-[#e8351e] group-hover:scale-110 transition-all" />
          </div>
          <h3 className="font-bold text-white/40 text-sm tracking-tight truncate w-full mb-1 group-hover:text-white transition-colors">Create Playlist</h3>
          <p className="text-white/10 text-[10px] font-bold uppercase tracking-widest">New Collection</p>
        </button>

        {playlists.map((playlist) => (
          <Link 
             key={playlist.id}
             href={`/playlist/${playlist.id}`}
             className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/10 hover:border-white/10 transition-all cursor-pointer group shadow-lg flex flex-col items-center text-center noise"
          >
            <div className="w-full aspect-square bg-white/5 border border-white/5 rounded-xl mb-5 flex items-center justify-center shadow-2xl relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-[#e8351e]/10 to-transparent"></div>
               <ListMusic className="w-12 h-12 text-white/20 group-hover:text-[#e8351e] group-hover:scale-110 transition-all" />
            </div>
            <h3 className="font-bold text-white text-sm tracking-tight truncate w-full mb-1">{playlist.name}</h3>
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">{playlist._count.songs} songs</p>
          </Link>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-[#1a1a1a] border border-white/10 p-10 rounded-[2.5rem] w-full max-w-md shadow-2xl relative noise overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#e8351e]/5 to-transparent pointer-events-none"></div>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-bold text-white mb-8 tracking-tight font-heading">New Playlist</h2>
            
            <form onSubmit={handleCreatePlaylist} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Playlist Name</label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="E.g. My Awesome Mix"
                  value={playlistName}
                  onChange={(e) => setPlaylistName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white text-lg font-medium focus:outline-none focus:border-[#e8351e]/50 focus:bg-white/10 transition-all placeholder:text-white/10 shadow-inner"
                />
              </div>
              
              <Button 
                type="submit"
                className="w-full bg-[#e8351e] hover:bg-[#c8291a] text-white font-bold py-5 rounded-2xl shadow-xl shadow-[#e8351e]/10 transition-all group border-none"
              >
                Create Collection
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
