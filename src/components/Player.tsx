"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Button } from "./ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle, X } from "lucide-react";
import ReactHowler from "react-howler";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function Player() {
  const { currentTrack, isPlaying, setIsPlaying, volume, setVolume, nextTrack, prevTrack, setCurrentTrack } = usePlayerStore();
  const [seek, setSeek] = useState(0);
  const [duration, setDuration] = useState(0);
  const playerRef = useRef<ReactHowler>(null);
  const rafRef = useRef<number>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const updateProgress = () => {
      if (playerRef.current && isPlaying) {
        const currentSeek = playerRef.current.seek();
        setSeek(currentSeek);
        setDuration(playerRef.current.duration());
        rafRef.current = requestAnimationFrame(updateProgress);
      }
    };

    if (isPlaying) {
      rafRef.current = requestAnimationFrame(updateProgress);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    const newTime = percentage * duration;
    playerRef.current.seek(newTime);
    setSeek(newTime);
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newVolume = Math.min(Math.max(x / rect.width, 0), 1);
    setVolume(newVolume);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-[#111]/90 backdrop-blur-2xl border-t border-white/5 px-8 flex items-center justify-between z-50 noise group/player">
      {currentTrack.url && (
        <ReactHowler
          ref={playerRef}
          src={currentTrack.url}
          playing={isPlaying}
          volume={volume}
          onEnd={nextTrack}
          html5={true}
          onLoad={() => setDuration(playerRef.current?.duration() || 0)}
        />
      )}
      
      {/* Close Button */}
      <button 
        onClick={() => setCurrentTrack(null)}
        className="absolute top-2 right-2 p-1 text-white/20 hover:text-white transition-colors opacity-0 group-hover/player:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-xl relative overflow-hidden shadow-lg">
           <div className="absolute inset-0 bg-gradient-to-br from-[#e8351e]/20 to-transparent"></div>
        </div>
        <div className="min-w-0">
          <div className="text-sm font-bold text-white tracking-tight truncate">{currentTrack.name}</div>
          <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest truncate">{currentTrack.artist.name}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-8">
          <Button variant="ghost" size="icon" className="text-white/20 hover:text-white transition-colors">
            <Shuffle className="w-3.5 h-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white transition-colors" onClick={prevTrack}>
            <SkipBack className="w-5 h-5 fill-current" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-11 h-11 bg-white text-[#111] hover:scale-105 transition-all rounded-full flex items-center justify-center shadow-xl shadow-white/5"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white transition-colors" onClick={nextTrack}>
            <SkipForward className="w-5 h-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white/20 hover:text-white transition-colors">
            <Repeat className="w-3.5 h-3.5" />
          </Button>
        </div>
        <div className="flex items-center gap-3 w-full max-w-lg">
           <span className="text-[9px] font-bold text-white/20 tabular-nums w-8 text-right">{formatTime(seek)}</span>
           <div 
             className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden relative group cursor-pointer"
             onClick={handleSeek}
           >
              <div 
                className="h-full bg-white relative z-10 group-hover:bg-[#e8351e] transition-colors"
                style={{ width: `${(seek / (duration || 1)) * 100}%` }}
              ></div>
              <div className="absolute inset-0 bg-white/5"></div>
           </div>
           <span className="text-[9px] font-bold text-white/20 tabular-nums w-8">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex items-center gap-6 w-1/3 justify-end">
        <div className="flex items-center gap-3">
          <Volume2 className="w-4 h-4 text-white/40" />
          <div 
            className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden relative group cursor-pointer"
            onClick={handleVolumeChange}
          >
            <div 
              className="h-full bg-white/60 group-hover:bg-white transition-colors" 
              style={{ width: `${volume * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
