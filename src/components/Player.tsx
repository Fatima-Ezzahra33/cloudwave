"use client";

import { usePlayerStore } from "@/store/usePlayerStore";
import { Button } from "./ui/button";
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from "lucide-react";
import ReactHowler from "react-howler";
import { useEffect, useState } from "react";

export default function Player() {
  const { currentTrack, isPlaying, setIsPlaying, volume, setVolume, nextTrack, prevTrack, progress, setProgress } = usePlayerStore();
  const [seek, setSeek] = useState(0);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSeek((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-zinc-900 border-t border-zinc-800 px-4 flex items-center justify-between z-50">
      {currentTrack.url && (
        <ReactHowler
          src={currentTrack.url}
          playing={isPlaying}
          volume={volume}
          onEnd={nextTrack}
        />
      )}
      
      <div className="flex items-center gap-4 w-1/3">
        <div className="w-14 h-14 bg-zinc-800 rounded-md"></div>
        <div>
          <div className="text-sm font-medium text-white">{currentTrack.name}</div>
          <div className="text-xs text-zinc-400">{currentTrack.artist.name}</div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2 w-1/3">
        <div className="flex items-center gap-6">
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Shuffle className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={prevTrack}>
            <SkipBack className="w-5 h-5 fill-current" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 bg-white text-black hover:bg-zinc-200 rounded-full flex items-center justify-center translate-x-0"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white" onClick={nextTrack}>
            <SkipForward className="w-5 h-5 fill-current" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <Repeat className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-md">
           <span className="text-[10px] text-zinc-500">0:00</span>
           <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div className="h-full bg-white w-1/3"></div>
           </div>
           <span className="text-[10px] text-zinc-500">3:45</span>
        </div>
      </div>

      <div className="flex items-center gap-4 w-1/3 justify-end">
        <Volume2 className="w-4 h-4 text-zinc-400" />
        <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white" 
            style={{ width: `${volume * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
